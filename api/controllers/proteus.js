import { Router } from 'express'

// eslint-disable-next-line no-unused-vars
import checkAuth from '../middleware/check-auth.js'
import {
  getProteusSettings,
  heartbeat,
} from '../services/proteus.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)
router.get('/application-settings', checkAuth, getProteusSettings)

export default router
