import aws from 'aws-sdk'

/**
 * Deletes a file from a bucket folder
 * @param {string} bucketEndpoint The bucket endpoint
 * @param {string} bucketName The bucket name
 * @param {string} key The key in format <folder_name>/<file_name>
 * @return {Promise}
 */
const deleteBucketItem = (bucketEndpoint, bucketName, key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const spacesEndpoint = new aws.Endpoint(bucketEndpoint)
      const s3 = new aws.S3({
        endpoint: spacesEndpoint,
        credentials: {
          secretAccessKey: process.env.BYOWAVE_RESOURCES_PROTEUS_SECRET_KEY,
          accessKeyId: process.env.BYOWAVE_RESOURCES_PROTEUS_ACCESS_KEY,
        },
      })

      s3.deleteObject({ Bucket: bucketName, Key: key }, (err, data) => {
        if (err) {
          throw new Error(err)
        } else {
          resolve(data)
        }
      })
    } catch (e) {
      reject(new Error(e.message))
    }
  })
}

export {
  deleteBucketItem,
}
