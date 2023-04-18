import Stripe from 'stripe'

import * as StripeUtils from '../../lib/stripe-lib.js'
import logger from '../../logger/index.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Auth endpoint heartbeat
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const heartbeat = (_req, res, _next) => {
  res.status(200).json({
    status: 200,
    message: 'Stripe endpoint',
  })
}

/**
 * Returns the Stripe publishable key
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getStripePublishableKey = (_req, res, _next) => {
  res.status(200).json({
    status: 200,
    message: 'OK',
    data: { publishableKey: process.env.STRIPE_PUBLISHABLE_KEY },
  })
}

/**
 * Stripe webhook handler
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const webhookHandler = async (req, res, _next) => {
  let event = req.body
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (process.env.STRIPE_ENDPOINT_SECRET) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature']
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_ENDPOINT_SECRET,
      )
    } catch (e) {
      logger.error(`stripe-service: Webhook signature verification failed: ${e.message}`)
      return res.sendStatus(400)
    }
  }

  // Handle the event
  switch (event.type) {
  case 'payment_intent.succeeded':
  case 'payment_intent.processing':
  case 'payment_intent.payment_failed':
  case 'payment_intent.created':
    StripeUtils.webhookHandlerPaymentIntent(event.type, event.data.object)
    break
  case 'payment_method.attached':
    // const paymentMethod = event.data.object
    // console.log(`PaymentMethod attached ${paymentMethod}`);
    // Then define and call a method to handle the successful attachment of a PaymentMethod.
    // handlePaymentMethodAttached(paymentMethod);
    break
  case 'account.application.deauthorized':
  case 'account.updated':
    // StripeUtils.webhookHandlerAccount(event.type, event.data.object)
    break
  case 'person.updated':
  case 'person.created':
    // StripeUtils.webhookHandlerPerson(event.type, event.data.object)
    break
  case 'capability.updated':
    // StripeUtils.webhookHandlerCapability(event.type, event.data.object)
    break
  default:
    // Unexpected event type
    // console.log(`Unhandled event type ${event.type}.`, event.data.object);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send()
}

export {
  getStripePublishableKey,
  heartbeat,
  webhookHandler,
}
