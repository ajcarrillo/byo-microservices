import { Router } from 'express'

// eslint-disable-next-line no-unused-vars
import checkAuth from '../middleware/check-auth.js'
import uploadImageController from '../middleware/upload-image-controller.js'
import {
  getProteusGalleryControllers,
  getProteusSettings,
  createProteusController,
  heartbeat,
} from '../services/proteus.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)
router.get('/application-settings', checkAuth, getProteusSettings)
router.post('/controller/create', checkAuth, uploadImageController.single('controllerImage'), createProteusController)
router.get('/gallery/controllers', checkAuth, getProteusGalleryControllers)

export default router
