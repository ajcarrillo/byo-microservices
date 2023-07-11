import { check, param, validationResult } from 'express-validator'

import logger from '../../logger/index.js'
import { removeHTMLTags } from '../sanitisers/input-sanitisers.js'
import { getProductFileByAddress } from '../../lib/sql/shop-sql.js'
import { getDocumentFile } from '../../lib/sql/media-sql.js'
import {
  getProductFileReadStream,
  getDocumentFileReadStream,
  getDocumentDownloadList,
  newDocument,
  updateExistingDocument,
} from '../../lib/media-lib.js'

/**
 * Media endpoint heartbeat
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const heartbeat = (_req, res, _next) => {
  res.status(200).json({
    status: 200,
    message: 'Media endpoint',
  })
}

/**
 * Creates a new document
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const createNewDocument = async (req, res, _next) => {
  await check('name').not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)
  await check('description').not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)
  await check('category').not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const response = await newDocument(
      req.file.originalname,
      req.file.key,
      req.file.size.toString(),
      req.file.mimetype,
      req.body.name,
      req.body.description,
      req.body.category,
    )

    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { ...response },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Updates a document
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const updateDocument = async (req, res, _next) => {
  await check('address').isAlphanumeric().not().isEmpty().trim().escape().run(req)
  await check('name').not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)
  await check('description').not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)
  await check('category').not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)
  await check('replaceDocumentFile').custom((value) => {
    if (value === 'true' || value === 'false') {
      return true
    } else {
      return false
    }
  }).not().isEmpty().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    await updateExistingDocument(
      req.body.address,
      req.body.name,
      req.body.description,
      req.body.category,
      req.body.replaceDocumentFile === 'true' ? true : false,
      req.file ? req.file.originalname : '',
      req.file ? req.file.key : '',
      req.file ? req.file.size.toString() : '',
      req.file ? req.file.mimetype : '',
    )

    res.status(200).json({
      status: 200,
      message: 'OK',
      data: {},
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Returns the downloadable documents
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getDocumentDownloads = async (req, res, _next) => {
  try {
    const documents = await getDocumentDownloadList()
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { documents },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Downloads a product file
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const downloadProductFile = async (req, res, _next) => {
  await param('address').isAlphanumeric().not().isEmpty().trim().escape().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const digitalFile = await getProductFileByAddress(req.params.address)

    if (digitalFile.length > 0) {
      const readStream = await getProductFileReadStream(
        `${digitalFile[0].location.slice(1)}/${digitalFile[0].stored_name}`)

      if (readStream) {
        res.setHeader('Content-disposition', 'attachment; filename=' + digitalFile[0].stored_name)
        res.setHeader('Access-Control-Expose-Headers', 'Content-disposition')
        res.setHeader('Content-type', digitalFile[0].mime_type)

        readStream.createReadStream()
          .on('error', (e) => {
            logger.error(`media-services: Failed to download product file with address ${req.params.address}: ${e}`)
            return res.status(422).json({
              status: 422,
              message: 'FILE_UNAVAILABLE',
            })
          })
          .pipe(res)
      } else {
        return res.status(422).json({
          status: 422,
          message: 'FILE_UNAVAILABLE',
        })
      }
    } else {
      return res.status(422).json({
        status: 422,
        message: 'FILE_UNAVAILABLE',
      })
    }
  } catch (e) {
    logger.error(`media-services: Failed to download product file with address ${req.params.address}: ${e}`)
    return res.status(422).json({
      status: 422,
      message: 'FILE_UNAVAILABLE',
    })
  }
}

/**
 * Downloads a document file
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const downloadDocumentFile = async (req, res, _next) => {
  await param('address').isAlphanumeric().not().isEmpty().trim().escape().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const digitalFile = await getDocumentFile(req.params.address)

    if (digitalFile.length > 0) {
      const readStream = await getDocumentFileReadStream(
        `${digitalFile[0].location.slice(1)}/${digitalFile[0].stored_name}`)

      if (readStream) {
        res.setHeader('Content-disposition', 'attachment; filename=' + digitalFile[0].orig_name)
        res.setHeader('Access-Control-Expose-Headers', 'Content-disposition')
        res.setHeader('Content-type', digitalFile[0].mime_type)

        readStream.createReadStream()
          .on('error', (e) => {
            logger.error(`media-services: Failed to download document file with address ${req.params.address}: ${e}`)
            return res.status(422).json({
              status: 422,
              message: 'FILE_UNAVAILABLE',
            })
          })
          .pipe(res)
      } else {
        return res.status(422).json({
          status: 422,
          message: 'FILE_UNAVAILABLE',
        })
      }
    } else {
      return res.status(422).json({
        status: 422,
        message: 'FILE_UNAVAILABLE',
      })
    }
  } catch (e) {
    logger.error(`media-services: Failed to download product file with address ${req.params.address}: ${e}`)
    return res.status(422).json({
      status: 422,
      message: 'FILE_UNAVAILABLE',
    })
  }
}

export {
  heartbeat,
  downloadProductFile,
  downloadDocumentFile,
  getDocumentDownloads,
  createNewDocument,
  updateDocument,
}
