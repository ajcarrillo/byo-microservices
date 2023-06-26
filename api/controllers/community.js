import { Router } from 'express'

// import checkAuth from '../middleware/check-auth.js'
import {
  getPosts,
  heartbeat,
} from '../services/community.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)
router.get('/posts', getPosts)

export default router
