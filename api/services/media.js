import aws from 'aws-sdk'
import { param, validationResult } from 'express-validator'

import { getProductFileByAddress } from '../../lib/sql/shop-sql.js'

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

  const digitalFile = await getProductFileByAddress(req.params.address)

  if (digitalFile.length > 0) {
    const spacesEndpoint = new aws.Endpoint(process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_ENDPOINT)
    const s3 = new aws.S3({
      endpoint: spacesEndpoint,
      credentials: {
        secretAccessKey: process.env.BYOWAVE_RESOURCES_PROTEUS_SECRET_KEY,
        accessKeyId: process.env.BYOWAVE_RESOURCES_PROTEUS_ACCESS_KEY,
      },
    })

    res.setHeader('Content-disposition', 'attachment; filename=' + digitalFile[0].stored_name)
    res.setHeader('Access-Control-Expose-Headers', 'Content-disposition')
    res.setHeader('Content-type', digitalFile[0].mime_type)

    s3.getObject({
      Key: `${digitalFile[0].location.slice(1)}/${digitalFile[0].stored_name}`,
      Bucket: process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_NAME,
    }).createReadStream().pipe(res)
  } else {
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
