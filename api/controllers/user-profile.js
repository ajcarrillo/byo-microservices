import { Router } from 'express'

import checkAuth from '../middleware/check-auth.js'
import { heartbeat, getUserProfileDetails } from '../services/user-profile.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)
router.get('/profile/details/:address', checkAuth, getUserProfileDetails)

export default router
