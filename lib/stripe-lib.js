import Stripe from 'stripe'

import logger from '../logger/index.js'
import {
  getAmericanStateCodeFromName,
  getCountryCodeFromISO,
} from '../lib/sql/shop-sql.js'
import {
  getOrderTaxCalculationId,
  updatePaymentIntentTransactionStatus,
  updatePaymentIntentSucceeded,
} from '../lib/sql/stripe-sql.js'
import { processPostPurchaseEvents } from '../lib/shop-lib.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Handles payment intent updates from Stripe
 * @param {string} eventType The payment intent event type
 * @param {*} dataObject The payment intent payload
 */
const webhookHandlerPaymentIntent = async (eventType, dataObject) => {
  const stripePaymentIntentId = dataObject.id
  const transactionId = dataObject.metadata.transactionId
  if (eventType === 'payment_intent.created') {
    //
  } else if (eventType === 'payment_intent.succeeded') {
    try {
      // Record the tax in Stripe Dashboard
      const taxRecord = await stripeRecordSalesTaxTransaction(transactionId)
      // Retieve the payment intent
      const stripeTransaction = await stripeRetrievePaymentIntent(stripePaymentIntentId)
      // Update the order
      await updatePaymentIntentSucceeded(transactionId, stripeTransaction, taxRecord.id)
      // Processs the transaction shipping request and reduce stock levels for physical goods
      await processPostPurchaseEvents(transactionId)
    } catch (e) {
      logger.error(`stripe-lib: (payment_intent.succeeded): 
        Failed to update succeeded transaction with ID ${transactionId}: ${e.message}`)
    }
  } else if (eventType === 'payment_intent.payment_failed') {
    try {
      await updatePaymentIntentTransactionStatus(transactionId, 'payment_failed')
    } catch (e) {
      logger.error(`stripe-lib: (payment_intent.payment_failed): 
        Failed to update failed transaction with ID ${transactionId}: ${e.message}`)
    }
  } else if (eventType === 'payment_intent.processing') {
    try {
      await updatePaymentIntentTransactionStatus(transactionId, 'payment_processing')
    } catch (e) {
      logger.error(`stripe-lib: (payment_intent.processing): 
        Failed to update processing transaction with ID ${transactionId}: ${e.message}`)
    }
  }
}

/**
 * Records a sales tax transaction on Stripe, and returns the response
 * @param {string} transactionId The order transaction ID
 * @return {Promise} The tax record object
 */
const stripeRecordSalesTaxTransaction = (transactionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const taxCalculation = await getOrderTaxCalculationId(transactionId)
      if (taxCalculation.length > 0) {
        const resource = Stripe.StripeResource.extend({
          request: Stripe.StripeResource.method({
            method: 'POST',
            path: 'tax/transactions/create_from_calculation',
          }),
        })
        // eslint-disable-next-line new-cap
        new resource(stripe).request(
          {
            'calculation': taxCalculation[0].stripe_tax_calculation_id,
            'reference': transactionId,
          },
          (err, response) => {
            if (err) {
              throw new Error(err.message)
            } else {
              resolve(response)
            }
          },
        )
      } else {
        throw new Error('Transaction ID Not Found')
      }
    } catch (e) {
      logger.error(`stripe-lib: Failed to record sales tax for transaction ID ${transactionId}: ${e.message}`)
      reject(new Error(e.message))
    }
  })
}

/**
 * Retrieves a payment intent transaction
 * @param {string} paymentIntentId Payment intent ID
 * @return {Promise} The payment intent transaction
 */
const stripeRetrievePaymentIntent = (paymentIntentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId,
        {
          expand: ['charges.data.balance_transaction'],
        },
      )
      const transaction = paymentIntent.charges.data[0].balance_transaction
      resolve(transaction)
    } catch (e) {
      logger.error(`stripe-lib: Failed to retrieve payment intent with ID ${paymentIntentId}: ${e}`)
      reject(new Error(e.raw.code.toUpperCase()))
    }
  })
}

/**
 * Creates a Stripe payment intent
 * @param {string} transactionId The transaction ID created for our own records
 * @param {number} paymentAmount A stripe-converted price
 * @param {number} taxCalculationId The ID of the Stripe tax calculation created during checkout summary
 * @return {Promise} The payment intent
 */
const stripeCreatePaymentIntent = (transactionId, paymentAmount, taxCalculationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: paymentAmount,
        currency: 'eur',
        payment_method_types: ['card'],
        metadata: {transactionId, calculation: taxCalculationId},
      })
      resolve(paymentIntent)
    } catch (e) {
      logger.error(`stripe-lib: Failed to create payment intent for transaction ID ${transactionId}: ${e}`)
      reject(new Error(e.raw.code.toUpperCase()))
    }
  })
}

/**
 * Updates a Stripe payment intent
 * @param {string} paymentIntentId The existing payment intent ID
 * @param {number} paymentAmount A stripe-converted price
 * @param {string} taxCalculationId The ID of the Stripe tax calculation created during checkout summary
 * @return {Promise} The payment intent
 */
const stripeUpdatePaymentIntent = (paymentIntentId, paymentAmount, taxCalculationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: paymentAmount,
        metadata: {calculation: taxCalculationId},
      })
      resolve(paymentIntent)
    } catch (e) {
      logger.error(`stripe-lib: Failed to update payment intent with ID ${paymentIntentId}: ${e}`)
      reject(new Error(e.raw.code.toUpperCase()))
    }
  })
}

/**
 * Calculates sales tax for a given basket and shipping address
 * @param {Array} basketItems The basket items and quantities
 * @param {any} billingAddress The customer billing address
 * @param {string | undefined} shippingCost The shipping cost
 * @return {Promise} The tax calculation and billing addres objects
 */
const stripeCalculateSalesTax = (basketItems, billingAddress, shippingCost) => {
  return new Promise(async (resolve, reject) => {
    try {
      const items = basketItems.map((bI) => {
        return {
          amount: stripePriceConversion(bI.productPrice) * parseInt(bI.productAmount),
          quantity: parseInt(bI.productAmount),
          reference: bI.productCode,
        }
      })

      let americanState
      if (billingAddress.countryCode === 'USA') {
        americanState = await getAmericanStateCodeFromName(billingAddress.regionCounty)
      }

      const countryCode = await getCountryCodeFromISO(billingAddress.countryCode)
      const taxAddress = {
        line1: billingAddress.addressLine1,
        city: billingAddress.townCity,
        country: countryCode[0].code,
        postal_code: billingAddress.zipPostcode,
        ...(americanState && {state: americanState[0].state_code}),
      }

      const taxCalculation = await stripe.tax.calculations.create({
        currency: 'eur',
        line_items: items,
        ...(shippingCost && {shipping_cost: {amount: stripePriceConversion(shippingCost)}}),
        customer_details: {
          address: taxAddress,
          address_source: 'billing',
        },
        expand: ['line_items.data.tax_breakdown'],
      })

      resolve({taxCalculation, taxAddress})
    } catch (e) {
      logger.error(`stripe-lib: Failed to calculate sales tax: ${e}`)
      reject(new Error(e.raw.code.toUpperCase()))
    }
  })
}

/**
 * Returns a stripe price format from a float string
 * @param {string} price A cost in this format 0.00
 * @return {number} The correct price in stripe format
 */
const stripePriceConversion = (price) => Math.round(parseFloat(price) * 100)

/**
 * Returns a float price from a stripe price
 * @param {number} price A cost in this format 1000
 * @return {string} The correct price as a float string to 2 decimals
 */
const stripeToFloatPriceConversion = (price) => (price / 100).toFixed(2)

export {
  stripeCalculateSalesTax,
  stripeCreatePaymentIntent,
  stripeUpdatePaymentIntent,
  stripeToFloatPriceConversion,
  webhookHandlerPaymentIntent,
}
