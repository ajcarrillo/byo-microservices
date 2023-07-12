import { Router } from 'express'

import checkAuth from '../middleware/check-auth.js'
import {
  heartbeat,
  downloadProductFile,
  getDocumentDownloads,
  downloadDocumentFile,
} from '../services/media.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)
router.get('/documents', getDocumentDownloads)
router.get('/download/document/file/:address', downloadDocumentFile)
router.get('/download/product/file/:address', checkAuth, downloadProductFile)

export default router
