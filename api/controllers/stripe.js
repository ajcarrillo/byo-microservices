import express, { Router } from 'express'

// eslint-disable-next-line no-unused-vars
import checkAuth from '../middleware/check-auth.js'
import {
  getStripePublishableKey,
  heartbeat,
  webhookHandler,
} from '../services/stripe.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)

router.get('/publishable-key', checkAuth, getStripePublishableKey)

// Webhook called by Stripe
router.post('/webhook', express.raw({type: 'application/json'}), webhookHandler)

export default router
