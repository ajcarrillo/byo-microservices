import path from 'path'
import multer from 'multer'
import multerS3 from 'multer-s3'
import aws from 'aws-sdk'

import * as Auth from '../../lib/auth-lib.js'

const spacesEndpoint = new aws.Endpoint(process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_ENDPOINT)
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  credentials: {
    secretAccessKey: process.env.BYOWAVE_RESOURCES_PROTEUS_SECRET_KEY,
    accessKeyId: process.env.BYOWAVE_RESOURCES_PROTEUS_ACCESS_KEY,
  },
})

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const uploadPdfDocument = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_NAME,
    acl: 'public-read',
    key: async (req, file, cb) => {
      const uuid = await Auth.createUniqueID()
      const sha1 = Auth.generateAddress(`${file.originalname}-${uuid}`)

      cb(null, `${process.env.SHOP_BUCKET_DOCUMENT_FILES_FOLDER}/${sha1}${path.extname(file.originalname)}`)
    },
    limits: {
      fileSize: 1024 * 1024 * 4, // 4MB
    },
    fileFilter: imageFileFilter,
  }),
})

export default uploadPdfDocument
