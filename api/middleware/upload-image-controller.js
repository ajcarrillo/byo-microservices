import path from 'path'
import multer from 'multer'

import * as Auth from '../../lib/auth-lib.js'

const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join('', './public/uploads/images/controllers/')
    cb(null, folder)
  },
  filename: async (req, file, cb) => {
    const uuid = await Auth.createUniqueID()
    const sha1 = Auth.generateAddress(`${req.user.address}-${uuid}`)

    cb(null, `${sha1}${path.extname(file.originalname)}`)
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
  storage: profileImageStorage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: imageFileFilter,
})

export default uploadImageController
