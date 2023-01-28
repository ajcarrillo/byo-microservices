import { Router } from 'express'

// eslint-disable-next-line no-unused-vars
import checkAuth from '../middleware/check-auth.js'
import {
  heartbeat,
  signIn,
} from '../services/auth.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)
router.post('/sign-in', signIn)

export default router
