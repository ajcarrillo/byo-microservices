import { Router } from 'express'

// eslint-disable-next-line no-unused-vars
import checkAuth from '../middleware/check-auth.js'
import {
  getModuleList,
  heartbeat,
} from '../services/controllers.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)
router.get('/module-list', getModuleList)

export default router
