/* eslint-disable max-len */
import {
  dbSelect,
  dbUpdate,
} from '../database-lib.js'
import { stripeToFloatPriceConversion } from '../../lib/stripe-lib.js'

/**
 * Updates a successful payment intent when a customer is successfully charged
 * @param {number} transactionId Transaction ID
 * @param {Object} stripeTransaction An object containing the Stripe Payment Intent
 * @param {string} taxRecordId The Stripe tax record ID
 * @return {Promise} The amount of changed rows - should be 1
 */
const updatePaymentIntentSucceeded = (transactionId, stripeTransaction, taxRecordId) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      UPDATE 
        shop_orders 
      SET 
        transaction_status = 'payment_succeeded', 
        stripe_tax_record_id = '${taxRecordId}',
        stripe_funds_available_timestamp = ${stripeTransaction.available_on}, 
        stripe_processing_fee = '${stripeToFloatPriceConversion(stripeTransaction.fee)}',
        stripe_exchange_rate = ${stripeTransaction.exchange_rate !== null ? "'"+stripeTransaction.exchange_rate+"'" : null} 
      WHERE 
        transaction_id = '${transactionId}';
    `
    try {
      const resultObj = await dbUpdate(sql)
      if (resultObj.error === null) {
        resolve(resultObj.changedRows)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Updates a payment intent transaction status
 * @param {number} transactionId Transaction ID
 * @param {string} status Payment intent status
 * @return {Promise} The amount of changed rows - should be 1
 */
const updatePaymentIntentTransactionStatus = (transactionId, status) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      UPDATE 
        shop_orders 
      SET 
        transaction_status = '${status}' 
      WHERE 
        transaction_id = '${transactionId}';
    `
    try {
      const resultObj = await dbUpdate(sql)
      if (resultObj.error === null) {
        resolve(resultObj.changedRows)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Retrieves a Stripe tax calculation ID from an order
 * @param {string} transactionId The transaction ID
 * @return {Promise}
 */
const getOrderTaxCalculationId = (transactionId) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT 
      stripe_tax_calculation_id 
    FROM 
      shop_orders 
    WHERE 
      transaction_id = '${transactionId}';
    `
    try {
      const resultObj = await dbSelect(sql)
      if (resultObj.error === null) {
        resolve(resultObj.results)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

export {
  getOrderTaxCalculationId,
  updatePaymentIntentSucceeded,
  updatePaymentIntentTransactionStatus,
}
