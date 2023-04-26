import path from 'path'
import multer from 'multer'
import multerS3 from 'multer-s3'
import aws from 'aws-sdk'

import * as Auth from '../../lib/auth-lib.js'

// const profileImageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = path.join('', './public/uploads/images/controllers/')
//     cb(null, folder)
//   },
//   filename: async (req, file, cb) => {
//     const uuid = await Auth.createUniqueID()
//     const sha1 = Auth.generateAddress(`${req.user.address}-${uuid}`)

//     cb(null, `${sha1}${path.extname(file.originalname)}`)
//   },
// })

// const uploadImageController = multer({
//   storage: profileImageStorage,
//   limits: {
//     fileSize: 1024 * 1024 * 5, // 5MB
//   },
//   fileFilter: imageFileFilter,
// })

const spacesEndpoint = new aws.Endpoint(process.env.BYOWAVE_RESOURCES_PROTEUS_BUCKET_ENDPOINT)
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  credentials: {
    secretAccessKey: process.env.BYOWAVE_RESOURCES_PROTEUS_SECRET_KEY,
    accessKeyId: process.env.BYOWAVE_RESOURCES_PROTEUS_ACCESS_KEY,
  },
})

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const uploadImageController = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BYOWAVE_RESOURCES_PROTEUS_BUCKET_NAME,
    acl: 'public-read',
    key: async (req, file, cb) => {
      const uuid = await Auth.createUniqueID()
      const sha1 = Auth.generateAddress(`${req.user.address}-${uuid}`)

      cb(null, `${sha1}${path.extname(file.originalname)}`)
    },
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: imageFileFilter,
  }),
})

export default uploadImageController
