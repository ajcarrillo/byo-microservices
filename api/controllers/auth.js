import { Router } from 'express'

// eslint-disable-next-line no-unused-vars
import checkAuth from '../middleware/check-auth.js'
import {
  changePassword,
  confirmEmail,
  heartbeat,
  requestPasswordReset,
  resendConfirmEmail,
  signIn,
  signUp,
} from '../services/auth.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)
router.post('/change-password', changePassword)
router.post('/confirm-email', confirmEmail)
router.post('/resend-confirm-email', resendConfirmEmail)
router.post('/request-password-reset', requestPasswordReset)
router.post('/sign-in', signIn)
router.post('/sign-up', signUp)

export default router
