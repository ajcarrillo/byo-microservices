import { param, validationResult } from 'express-validator'

import logger from '../../logger/index.js'
import { getProductFileByAddress } from '../../lib/sql/shop-sql.js'
import { getProductFileReadStream } from '../../lib/media-lib.js'

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

export {
  heartbeat,
  downloadProductFile,
}
