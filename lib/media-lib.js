import aws from 'aws-sdk'

import logger from '../logger/index.js'

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
      logger.error(`media-lib: Failed to download product file with key ${key}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

export {
  getProductFileReadStream,
}
