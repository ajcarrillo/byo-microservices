import aws from 'aws-sdk'

import logger from '../logger/index.js'
import * as Auth from '../lib/auth-lib.js'
import { mysqlRealEscapeString } from '../lib/database-lib.js'
import { deleteBucketItem } from '../lib/cdn-lib.js'
import {
  getAllDocumentDownloads,
  createNewDocument,
  createNewDocumentFile,
  updateDocument,
  getDocumentFile,
  deleteDocumentFile,
} from './sql/media-sql.js'

/**
 * Creates a new document
 * @param {string} originalName The original name of the file
 * @param {string} key The new file name and folder for the file
 * @param {string} size The file size
 * @param {string} mimetype The file mime type
 * @param {string} documentName The new document name
 * @param {string} documentDescription The document description
 * @param {string} documentCategory The document category
 * @return {Promise}
 */
const newDocument = (
  originalName,
  key,
  size,
  mimetype,
  documentName,
  documentDescription,
  documentCategory,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const keyParts = key.split('/')
      const filename = keyParts[keyParts.length-1]

      const uid = await Auth.createUniqueID()
      const fileAddress = Auth.generateAddress(uid + filename)
      const documentAddress = Auth.generateAddress(uid + documentName)
      const origName = mysqlRealEscapeString(originalName)
      const fName = mysqlRealEscapeString(filename)
      const dest = mysqlRealEscapeString(`/${process.env.SHOP_BUCKET_DOCUMENT_FILES_FOLDER}`)
      const dName = mysqlRealEscapeString(documentName)
      const dDesc = mysqlRealEscapeString(documentDescription)
      const dCat = mysqlRealEscapeString(documentCategory)

      const documents = await getAllDocumentDownloads()
      if (documents.some((d) => d.document_name === dName)) {
        await deleteBucketItem(
          process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_ENDPOINT,
          process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_NAME,
          key,
        )
        reject(new Error('DUPLICATE_NAME'))
      } else {
        await createNewDocumentFile(fileAddress, origName, fName, mimetype, dest, size)
        const documentUID = await createNewDocument(documentAddress, fileAddress, dName, dDesc, dCat)
        resolve(documentUID)
      }
    } catch (e) {
      logger.error(`media-lib: Failed to create new document with name ${documentName}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Updates a shop group
 * @param {string} documentAddress The document address
 * @param {string} documentName The document name
 * @param {string} documentDescription The document description
 * @param {string} documentCategory The document category
 * @param {boolean} replaceFile Replace the file true/false
 * @param {string} originalName The original name of the image
 * @param {string} key The new file name and folder for the image
 * @param {string} size The image file size
 * @param {string} mimetype The image mime type
 * @return {Promise}
 */
const updateExistingDocument = (
  documentAddress,
  documentName,
  documentDescription,
  documentCategory,
  replaceFile,
  originalName,
  key,
  size,
  mimetype,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let fileAddress
      let origName
      let fName
      let dest
      if (replaceFile) {
        const keyParts = key.split('/')
        const filename = keyParts[keyParts.length-1]
        const uid = await Auth.createUniqueID()
        fileAddress = Auth.generateAddress(uid + filename)
        origName = mysqlRealEscapeString(originalName)
        fName = mysqlRealEscapeString(filename)
        dest = mysqlRealEscapeString(`/${process.env.SHOP_BUCKET_DOCUMENT_FILES_FOLDER}`)
      }

      const dName = mysqlRealEscapeString(documentName)
      const dDesc = mysqlRealEscapeString(documentDescription)
      const dCat = mysqlRealEscapeString(documentCategory)

      const documents = await getAllDocumentDownloads()
      if (documents.some((d) => d.document_name === dName && d.address !== documentAddress)) {
        if (replaceFile) {
          await deleteBucketItem(
            process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_ENDPOINT,
            process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_NAME,
            key,
          )
        }
        reject(new Error('DUPLICATE_NAME'))
      } else {
        const existingDoc = documents.find((eD) => eD.address === documentAddress)
        if (existingDoc) {
          if (replaceFile) {
            // Remove old file
            const file = await getDocumentFile(existingDoc.document_file_address)
            await deleteBucketItem(
              process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_ENDPOINT,
              process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_NAME,
              `${file[0].location.slice(1)}/${file[0].stored_name}`,
            )
            await deleteDocumentFile(existingDoc.document_file_address)

            // Create new file
            await createNewDocumentFile(fileAddress, origName, fName, mimetype, dest, size)
          }

          const fileToSave = replaceFile ? fileAddress : existingDoc.document_file_address
          await updateDocument(documentAddress, fileToSave, dName, dDesc, dCat)
          resolve()
        } else {
          reject(new Error('DOCUMENT_NOT_FOUND'))
        }
      }
    } catch (e) {
      logger.error(`media-lib: Failed to update document with address ${documentAddress}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns a list of downloadable documents
 * @return {Promise}
 */
const getDocumentDownloadList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await getAllDocumentDownloads()
      if (results.length > 0) {
        const docs = []
        for (let p = 0; p < results.length; p++) {
          const file = await getDocumentFile(results[p].document_file_address)
          docs.push({
            documentAddress: results[p].address,
            documentName: results[p].document_name,
            documentDescription: results[p].document_description,
            documentCategory: results[p].document_category,
            documentFileName: file[0].orig_name,
            documentFileAddress: file[0].address,
          })
        }
        resolve(docs)
      } else {
        resolve([])
      }
    } catch (e) {
      logger.error(`media-lib: Failed to get document list: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns a readable stream for a product file
 * @param {string} key The folder/filename for the file to get
 * @return {Promise}
 */
const getProductFileReadStream = (key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const spacesEndpoint = new aws.Endpoint(process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_ENDPOINT)
      const s3 = new aws.S3({
        endpoint: spacesEndpoint,
        credentials: {
          secretAccessKey: process.env.BYOWAVE_RESOURCES_PROTEUS_SECRET_KEY,
          accessKeyId: process.env.BYOWAVE_RESOURCES_PROTEUS_ACCESS_KEY,
        },
      })

      const readStream = s3.getObject({
        Key: key,
        Bucket: process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_NAME,
      })

      resolve(readStream)
    } catch (e) {
      logger.error(`media-lib: Failed to get product file read stream with key ${key}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns a readable stream for a document file
 * @param {string} key The folder/filename for the file to get
 * @return {Promise}
 */
const getDocumentFileReadStream = (key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const spacesEndpoint = new aws.Endpoint(process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_ENDPOINT)
      const s3 = new aws.S3({
        endpoint: spacesEndpoint,
        credentials: {
          secretAccessKey: process.env.BYOWAVE_RESOURCES_PROTEUS_SECRET_KEY,
          accessKeyId: process.env.BYOWAVE_RESOURCES_PROTEUS_ACCESS_KEY,
        },
      })

      const readStream = s3.getObject({
        Key: key,
        Bucket: process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_NAME,
      })

      resolve(readStream)
    } catch (e) {
      logger.error(`media-lib: Failed to get document file read stream with key ${key}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

export {
  getProductFileReadStream,
  getDocumentFileReadStream,
  getDocumentDownloadList,
  newDocument,
  updateExistingDocument,
}
