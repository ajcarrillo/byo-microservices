import {
  dbDelete,
  dbInsert,
  dbSelect,
  dbUpdate,
} from '../database-lib.js'

/**
 * Creates a new document
 * @param {string} documentddress Document address
 * @param {string} fileAddress Document file address
 * @param {string} dName Document name
 * @param {string} dDesc Document description
 * @param {string} dCat Document category
 * @return {Promise}
 */
const createNewDocument = (documentddress, fileAddress, dName, dDesc, dCat) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO downloads_documents 
      (address, document_name, document_description, document_category, document_file_address) 
      VALUES ('${documentddress}', '${dName}', '${dDesc}', '${dCat}', '${fileAddress}');
    `
    try {
      const resultObj = await dbInsert(sql)
      if (resultObj.error === null && resultObj.insertID > 0) {
        resolve(resultObj.insertID)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Creates a new file in the downloads_documents_files table
 * @param {string} address A unique address
 * @param {string} origName The original file name
 * @param {string} storedName The saved file name
 * @param {string} mime Mime type
 * @param {string} location Stored location
 * @param {string} size File size
 * @return {Promise}
 */
const createNewDocumentFile = (address, origName, storedName, mime, location, size) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO downloads_documents_files (address, orig_name, stored_name, mime_type, location, size) 
      VALUES ('${address}', '${origName}', '${storedName}', '${mime}', '${location}', '${size}');
    `
    try {
      const resultObj = await dbInsert(sql)
      if (resultObj.error === null && resultObj.insertID > 0) {
        resolve(resultObj.insertID)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Updates a document
 * @param {string} docAddress Document address
 * @param {string} fileAddress Document file address
 * @param {string} docName Document name
 * @param {string} docDesc Document description
 * @param {string} docCategory Document category
 * @return {Promise}
 */
const updateDocument = (docAddress, fileAddress, docName, docDesc, docCategory) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      UPDATE downloads_documents 
      SET 
        document_name = '${docName}', 
        document_description = '${docDesc}', 
        document_category = '${docCategory}', 
        document_file_address = '${fileAddress}'  
      WHERE 
        address = '${docAddress}';
    `
    try {
      const resultObj = await dbUpdate(sql)
      if (resultObj.error === null) {
        resolve(resultObj.changedRows)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Returns all the downloadable documents
 * @return {Promise} An array of results
 */
const getAllDocumentDownloads = () => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * FROM downloads_documents;
    `
    try {
      const resultObj = await dbSelect(sql)
      if (resultObj.error === null) {
        resolve(resultObj.results)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Returns a document's file details
 * @param {string} address The file address
 * @return {Promise} An array of results
 */
const getDocumentFile = (address) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * FROM downloads_documents_files 
    WHERE address = '${address}';
    `
    try {
      const resultObj = await dbSelect(sql)
      if (resultObj.error === null) {
        resolve(resultObj.results)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Deletes a document file
 * @param {*} address File address
 * @return {Promise} Number of affected rows
 */
const deleteDocumentFile = (address) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    DELETE FROM downloads_documents_files 
    WHERE downloads_documents_files.address = '${address}';
    `
    try {
      const resultObj = await dbDelete(sql)
      if (resultObj.error === null) {
        resolve(resultObj.affectedRows)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

export {
  createNewDocument,
  updateDocument,
  createNewDocumentFile,
  getAllDocumentDownloads,
  getDocumentFile,
  deleteDocumentFile,
}
