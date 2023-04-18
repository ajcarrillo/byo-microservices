import logger from '../logger/index.js'
import * as Auth from '../lib/auth-lib.js'
import * as Financial from '../lib/financial-lib.js'
import { mysqlRealEscapeString } from '../lib/database-lib.js'
import {
  stripeCalculateSalesTax,
  stripeCreatePaymentIntent,
  stripeUpdatePaymentIntent,
  stripeToFloatPriceConversion,
} from '../lib/stripe-lib.js'
import { updateUserName } from './sql/user-sql.js'
import {
  getCompleteCountryList,
  getCompleteAmericanStateList,
  getCustomerContacts,
  createCustomerContact,
  updateCustomerContact,
  getCompleteProductList,
  getProductByCode,
  getProductImageList,
  getProductPriceList,
  getCustomerPendingOrder,
  getCustomerOrders,
  createCustomerOrder,
  updateCustomerOrder,
} from './sql/shop-sql.js'
import {
  resolveShopOrderStatus,
  resolveShopPaymentStatus,
} from '../utils/shop-utils.js'

/**
 * Returns all the shop products
 * @return {Promise}
 */
const getAllShopProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await getCompleteProductList()
      if (results.length > 0) {
        const products = []
        for (let p = 0; p < results.length; p++) {
          const imgList = results[p].product_image_addresses.split(',').join('","')
          const images = await getProductImageList(`"${imgList}"`)
          products.push({
            productAddress: results[p].address,
            productCode: results[p].product_code,
            productName: results[p].product_name,
            productDescription: results[p].product_description,
            productPrice: results[p].product_price,
            productImages: images.map((i) =>
              `${process.env.IMAGE_SERVER_DOMAIN}/${i.location.replace(/\\/g, '/')}${i.stored_name}`),
            productDispatchTime: results[p].product_dispatch_time,
          })
        }
        resolve(products)
      } else {
        resolve([])
      }
    } catch (e) {
      logger.error(`shop-lib: Failed to get all shop products: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns a shop product by code
 * @param {*} code The product code
 * @return {Promise} A product object
 */
const getShopProductByCode = (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await getProductByCode(code)
      if (results.length > 0) {
        const imgList = results[0].product_image_addresses.split(',').join('","')
        const images = await getProductImageList(`"${imgList}"`)
        const product = {
          productAddress: results[0].address,
          productCode: results[0].product_code,
          productName: results[0].product_name,
          productDescription: results[0].product_description,
          productPrice: results[0].product_price,
          productImages: images.map((i) =>
            `${process.env.IMAGE_SERVER_DOMAIN}/${i.location.replace(/\\/g, '/')}${i.stored_name}`),
          productDispatchTime: results[0].product_dispatch_time,
        }
        resolve(product)
      } else {
        resolve(null)
      }
    } catch (e) {
      logger.error(`shop-lib: Failed to get shop product with product code ${code}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns a list of countries and currency codes
 * @return {Promise}
 */
const getCountriesAndCurrencies = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await getCompleteCountryList()
      resolve(results)
    } catch (e) {
      logger.error(`shop-lib: Failed to get country list: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns a list of American states
 * @return {Promise}
 */
const getAmericanStates = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await getCompleteAmericanStateList()
      resolve(results)
    } catch (e) {
      logger.error(`shop-lib: Failed to get American state list: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns a customer's contact details
 * @param {number} userId
 * @return {Promise}
 */
const getCustomerContactDetails = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await getCustomerContacts(userId)
      resolve({
        contacts: contacts.map((cD) => ({
          address: cD.address === null ? '' : cD.address,
          name: cD.contact_name === null ? '' : cD.contact_name,
          addressLine1: cD.address_line_1 === null ? '' : cD.address_line_1,
          addressLine2: cD.address_line_2 === null ? '' : cD.address_line_2,
          townCity: cD.town_city === null ? '' : cD.town_city,
          regionCounty: cD.region_county === null ? '' : cD.region_county,
          zipPostcode: cD.zip_postcode === null ? '' : cD.zip_postcode,
          countryCode: cD.country_code === null ? '' : cD.country_code,
          telephone: cD.telephone === null ? '' : cD.telephone,
        })),
        user: {
          address: contacts[0].userAddress,
          email: contacts[0].email_address,
          firstName: contacts[0].first_name,
          lastName: contacts[0].last_name,
          languageCode: contacts[0].language_code,
          hasDisabilities: contacts[0].has_disabilities,
        },
      })
    } catch (e) {
      logger.error(`shop-lib: Failed to get customer contact details for user ID ${userId}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns a customer's orders
 * @param {number} userId
 * @return {Promise}
 */
const getCustomerOrderList = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await getCustomerOrders(userId)
      const list = []
      for (let o = 0; o < orders.length; o++) {
        const basketItems = JSON.parse(orders[o].order_items)
        const products = []
        for (let p = 0; p < basketItems.length; p++) {
          const product = await getShopProductByCode(basketItems[p].productCode)
          product.amount = basketItems[p].productAmount
          products.push(product)
        }

        list.push({
          products,
          paymentStatus: resolveShopPaymentStatus(orders[o].transaction_status),
          orderStatus: resolveShopOrderStatus(orders[o].order_status),
          orderDate: orders[o].transaction_timestamp,
          orderTransactionId: orders[o].transaction_id,
          orderPaymentSummary: {
            sub: orders[o].order_subtotal,
            shipping: orders[o].order_shipping,
            tax: orders[o].order_tax,
            total: orders[o].order_total,
          },
          deliveryAddress: JSON.parse(orders[o].delivery_address),
        })
      }
      resolve(list)
    } catch (e) {
      logger.error(`shop-lib: Failed to get customer orders for user ID ${userId}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Saves an array of contact details
 * @param {number} userId User ID
 * @param {Array} contacts An array of contact details
 * @return {Promise}
 */
const saveCustomerContactDetails = (userId, contacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].address && contacts[i].address !== '') {
          // Existing contact - update
          await updateCustomerContact(userId, contacts[i])
        } else {
          // New contact
          const uid = await Auth.createUniqueID()
          const contactAddress = Auth.generateAddress(uid + contacts[i].zipPostcode)
          await createCustomerContact(userId, contactAddress, contacts[i])
        }

        if (contacts[i].name === 'billing') {
          await updateUserName(userId, contacts[i].firstName, contacts[i].lastName)
        }
      }

      const updatedContacts = await getCustomerContacts(userId)
      resolve(updatedContacts)
    } catch (e) {
      logger.error(`shop-lib: Failed to save customer contact details for user ID ${userId}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns the shipping for a list of products, based on location
 * @param {Array} itemList An array of products and the amounts
 * @param {*} countryCode ISO 3 country code
 * @param {*} zipPostcode A Zip/Postcode
 * @return {Promise}
 */
const getSalesShippingCosts = (itemList, countryCode, zipPostcode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const shippingCostPerItem = '20.00'
      const itemCosts = []
      itemList.forEach((b) => {
        itemCosts.push(Financial.multiplyFloatValues(shippingCostPerItem, b.productAmount))
      })
      const shipping = Financial.addFloatValues(itemCosts)
      resolve(shipping)
    } catch (e) {
      logger.error(`shop-lib: Failed to get shipping costs: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Creates a new sales transaction and returns a payment intent
 * @param {number} userId User ID
 * @param {string} userAddress The unique user address
 * @param {Array} basketItems An array of basket items
 * @param {string} deliveryAddress Which address for delivery - billing/delivery
 * @param {string} stripeClientSecret The Stripe client secret, if one exists
 * @return {Promise}
 */
const createNewSalesTransaction = (
  userId,
  userAddress,
  basketItems,
  deliveryAddress,
  stripeClientSecret,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get the product prices for the basket items
      const codes = basketItems.map((bI) => bI.productCode).join('","')
      const priceList = await getProductPriceList(`"${codes}"`)

      // Append prices to the basket
      const basket = basketItems.map((bI) => {
        return {
          productCode: bI.productCode,
          productPrice: priceList.find((p) => p.product_code === bI.productCode).product_price.toString(),
          productAmount: bI.productAmount.toString(),
        }
      })

      // Create the subtotal
      const itemCosts = basket.map((i) => Financial.multiplyFloatValues(i.productPrice, i.productAmount))
      const subtotalCost = Financial.addFloatValues(itemCosts)

      // Get the users contact addresses - extract the shipping address
      const contactList = await getCustomerContactDetails(userId)
      const billingAddress = contactList.contacts.find((cD) => cD.name === 'billing')
      const shippingAddress = contactList.contacts.find((cD) => cD.name === deliveryAddress)

      // Get the shipping cost
      const shippingCost = await getSalesShippingCosts(basket, shippingAddress.countryCode, shippingAddress.zipPostcode)

      // Get the tax calculation based on the Billing Address, and include shipping costs in the calculation
      const {taxCalculation, taxAddress} = await stripeCalculateSalesTax(basket, billingAddress, shippingCost)

      // Check if the user has an open transaction record in the DB, where payment has not been completed
      let existingId = null
      let existingPaymentIntentId = null
      let existingTransactionId = null
      if (stripeClientSecret) {
        const pendingOrder = await getCustomerPendingOrder(userId, stripeClientSecret)
        if (pendingOrder.length > 0) {
          existingId = pendingOrder[0].uid
          existingPaymentIntentId = pendingOrder[0].stripe_payment_intent_id
          existingTransactionId = pendingOrder[0].transaction_id
        }
      }

      // Create a new order
      if (existingId === null) {
        const uuid = await Auth.createUniqueID()
        const transactionId = Auth.generateAddress(`${userAddress}-${uuid}`)

        const paymentIntent = await stripeCreatePaymentIntent(
          transactionId,
          taxCalculation.amount_total,
          taxCalculation.id,
        )

        await createCustomerOrder(
          userId,
          transactionId,
          subtotalCost,
          shippingCost,
          stripeToFloatPriceConversion(taxCalculation.tax_amount_exclusive),
          stripeToFloatPriceConversion(taxCalculation.amount_total),
          mysqlRealEscapeString(JSON.stringify(basket)),
          mysqlRealEscapeString(JSON.stringify(billingAddress)),
          mysqlRealEscapeString(JSON.stringify(shippingAddress)),
          paymentIntent.client_secret,
          paymentIntent.id,
          taxCalculation.id,
        )

        resolve({
          transactionStatus: 'new',
          transactionId: transactionId,
          stripeClientSecret: paymentIntent.client_secret,
          salesAmount: {
            sub: subtotalCost,
            shipping: shippingCost,
            tax: stripeToFloatPriceConversion(taxCalculation.tax_amount_exclusive),
            total: stripeToFloatPriceConversion(taxCalculation.amount_total),
          },
          taxAddress,
        })
      // Update existing order
      } else {
        const paymentIntentUpdate = await stripeUpdatePaymentIntent(
          existingPaymentIntentId,
          taxCalculation.amount_total,
          taxCalculation.id,
        )

        await updateCustomerOrder(
          existingId,
          userId,
          subtotalCost,
          shippingCost,
          stripeToFloatPriceConversion(taxCalculation.tax_amount_exclusive),
          stripeToFloatPriceConversion(taxCalculation.amount_total),
          mysqlRealEscapeString(JSON.stringify(basket)),
          mysqlRealEscapeString(JSON.stringify(billingAddress)),
          mysqlRealEscapeString(JSON.stringify(shippingAddress)),
          paymentIntentUpdate.client_secret,
          paymentIntentUpdate.id,
          taxCalculation.id,
        )

        resolve({
          transactionStatus: 'new',
          transactionId: existingTransactionId,
          stripeClientSecret: paymentIntentUpdate.client_secret,
          salesAmount: {
            sub: subtotalCost,
            shipping: shippingCost,
            tax: stripeToFloatPriceConversion(taxCalculation.tax_amount_exclusive),
            total: stripeToFloatPriceConversion(taxCalculation.amount_total),
          },
          taxAddress,
        })
      }
    } catch (e) {
      logger.error(`shop-lib: Failed to create new sales transaction for user ID ${userId}: ${e}`)
      reject(new Error(e.message))
    }
  })
}

export {
  createNewSalesTransaction,
  getCountriesAndCurrencies,
  getAmericanStates,
  getCustomerContactDetails,
  getCustomerOrderList,
  getSalesShippingCosts,
  saveCustomerContactDetails,
  getAllShopProducts,
}
