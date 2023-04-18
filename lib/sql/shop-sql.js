import {
  dbInsert,
  dbSelect,
  dbUpdate,
} from '../database-lib.js'

/**
 * Returns a list of countries
 * @return {Promise} An array of results
 */
const getCompleteCountryList = () => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * FROM list_countries;
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

/**
 * Returns a two digit country code from a three digit country code
 * @param {string} iso A three digit country code
 * @return {Promise} A two digit country code
 */
const getCountryCodeFromISO = (iso) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT list_countries.code FROM list_countries WHERE list_countries.alpha_3 = '${iso}';
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

/**
 * Returns a list of American states
 * @return {Promise} An array of results
 */
const getCompleteAmericanStateList = () => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * FROM list_north_america_states;
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

/**
 * Returns a two digit state code from a state name
 * @param {string} stateName A state name
 * @return {Promise} A two digit state code
 */
const getAmericanStateCodeFromName = (stateName) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT list_north_america_states.state_code 
    FROM list_north_america_states 
    WHERE list_north_america_states.state_name = '${stateName}';
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

/**
 * Returns all the shop products
 * @return {Promise} An array of results
 */
const getCompleteProductList = () => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * FROM shop_products;
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

/**
 * Gets a shop product by product code
 * @param {*} code Product code
 * @return {Promise} A product
 */
const getProductByCode = (code) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * FROM shop_products WHERE shop_products.product_code = '${code}';
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

/**
 * Returns all the shop products
 * @param {string} addresses A comma separated list of image addresses
 * @return {Promise} An array of results
 */
const getProductImageList = (addresses) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT 
      shop_images.stored_name, shop_images.location  
    FROM shop_images 
      WHERE shop_images.address IN (${addresses});
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

/**
 * Returns the prices for a list of product codes
 * @param {string} productCodes A comma separated list of product codes
 * @return {Promise} An array of results
 */
const getProductPriceList = (productCodes) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT 
      shop_products.product_code, shop_products.product_price  
    FROM shop_products 
      WHERE shop_products.product_code IN (${productCodes});
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

/**
 * Returns a user contact details
 * @param {number} userId
 * @return {Promise} An array of results
 */
const getCustomerContacts = (userId) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT 
      users.address AS userAddress,
      users.first_name,
      users.last_name,
      users.email_address,
      users.language_code,
      users.has_disabilities,
      users_contacts.*  
    FROM users 
    LEFT OUTER JOIN users_contacts
      ON users.uid = users_contacts.user_id
    WHERE users.uid = ${userId};
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

/**
 * Inserts a new customer contact
 * @param {number} userId User ID
 * @param {string} address New address for the contact
 * @param {Object} contact An object containing the contact details
 * @return {Promise} The new insert ID
 */
const createCustomerContact = (userId, address, contact) => {
  console.log('gggggggggggg', contact)
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO users_contacts (
        address, user_id, contact_name, address_line_1, address_line_2, 
        town_city, region_county, zip_postcode, country_code, telephone
      ) 
      VALUES (
        '${address}', ${userId}, '${contact.name}', '${contact.addressLine1}', '${contact.addressLine2}', 
        '${contact.townCity}', '${contact.regionCounty}', '${contact.zipPostcode}', '${contact.countryCode}', 
        '${contact.telephone}'
      );
    `
    try {
      const insertObj = await dbInsert(sql)
      if (insertObj.error === null && insertObj.insertID > 0) {
        resolve(insertObj.insertID)
      } else {
        throw new Error(insertObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Updates a customer contact
 * @param {number} userId User ID
 * @param {Object} contact An object containing the contact details
 * @return {Promise} The amount of changed rows - should be 1
 */
const updateCustomerContact = (userId, contact) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      UPDATE users_contacts 
      SET 
        address_line_1 = '${contact.addressLine1}', 
        address_line_2 = ${contact.addressLine2 === '' ? null : "'"+contact.addressLine2+"'"},
        town_city = '${contact.townCity}',
        region_county = '${contact.regionCounty}',
        zip_postcode = '${contact.zipPostcode}',
        country_code = '${contact.countryCode}',
        telephone = ${contact.telephone === '' ? null : "'"+contact.telephone+"'"} 
      WHERE address = '${contact.address}' AND user_id = ${userId};
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
 * Returns an open order, where payment has not been completed
 * @param {number} userId User ID
 * @param {number} stripeClientSecret The Stripe client secret
 * @return {Promise} An array of pending transactions
 */
const getCustomerPendingOrder = (userId, stripeClientSecret) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT 
      shop_orders.uid, 
      shop_orders.transaction_id, 
      shop_orders.stripe_client_secret, 
      shop_orders.stripe_payment_intent_id, 
      shop_orders.stripe_tax_calculation_id  
    FROM shop_orders 
    WHERE shop_orders.customer_uid = ${userId} 
    AND shop_orders.stripe_client_secret = '${stripeClientSecret}' 
    AND shop_orders.transaction_status = 'payment_requested';
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

/**
 * Returns all the customer's orders
 * @param {number} userId User ID
 * @return {Promise} An array of pending transactions
 */
const getCustomerOrders = (userId) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * 
    FROM shop_orders 
    WHERE shop_orders.customer_uid = ${userId} 
    ORDER BY shop_orders.uid DESC;
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

/**
 * Creates a new sales order
 * @param {number} userId The user ID
 * @param {string} transactionId The transaction ID
 * @param {string} transactionSubtotal The subtotal cost
 * @param {string} transactionShipping The shipping cost
 * @param {string} transactionTax The tax cost
 * @param {string} transactionTotal The total cost
 * @param {string} basketItems JSON string of basket items
 * @param {string} billingAddress JSON string of billing address
 * @param {string} shippingAddress JSON string of delivery address
 * @param {string} stripeClientSecret The Stripe client secret
 * @param {string} stripePaymentIntentId The Stripe payment intent ID
 * @param {string} stripeTaxCalculationId The Stripe tax calculation ID
 * @return {Promise}
 */
const createCustomerOrder = (
  userId,
  transactionId,
  transactionSubtotal,
  transactionShipping,
  transactionTax,
  transactionTotal,
  basketItems,
  billingAddress,
  shippingAddress,
  stripeClientSecret,
  stripePaymentIntentId,
  stripeTaxCalculationId,
) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO shop_orders 
      (
        customer_uid, billing_address, delivery_address, order_items, 
        order_subtotal, order_shipping, order_tax, order_total, 
        order_status, transaction_status, transaction_id, transaction_timestamp,
        stripe_client_secret, stripe_payment_intent_id, stripe_tax_calculation_id
      ) 
      VALUES 
      (
        ${userId}, '${billingAddress}', '${shippingAddress}', '${basketItems}', 
        '${transactionSubtotal}', '${transactionShipping}', '${transactionTax}', '${transactionTotal}', 
        'processing', 'payment_requested', '${transactionId}', UNIX_TIMESTAMP(),
        '${stripeClientSecret}', '${stripePaymentIntentId}', '${stripeTaxCalculationId}'
      );
    `
    try {
      const insertObj = await dbInsert(sql)
      if (insertObj.error === null && insertObj.insertID > 0) {
        resolve(insertObj.insertID)
      } else {
        throw new Error(insertObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Updates an existing sales order
 * @param {number} orderId The order ID
 * @param {number} userId The user ID
 * @param {string} transactionSubtotal The subtotal cost
 * @param {string} transactionShipping The shipping cost
 * @param {string} transactionTax The tax cost
 * @param {string} transactionTotal The total cost
 * @param {string} basketItems JSON string of basket items
 * @param {string} billingAddress JSON string of billing address
 * @param {string} shippingAddress JSON string of delivery address
 * @param {string} stripeClientSecret The Stripe client secret
 * @param {string} stripePaymentIntentId The Stripe payment intent ID
 * @param {string} stripeTaxCalculationId The Stripe tax calculation ID
 * @return {Promise}
 */
const updateCustomerOrder = (
  orderId,
  userId,
  transactionSubtotal,
  transactionShipping,
  transactionTax,
  transactionTotal,
  basketItems,
  billingAddress,
  shippingAddress,
  stripeClientSecret,
  stripePaymentIntentId,
  stripeTaxCalculationId,
) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      UPDATE shop_orders 
      SET
        billing_address = '${billingAddress}', 
        delivery_address = '${shippingAddress}', 
        order_items = '${basketItems}', 
        order_subtotal = '${transactionSubtotal}', 
        order_shipping = '${transactionShipping}', 
        order_tax = '${transactionTax}', 
        order_total = '${transactionTotal}', 
        transaction_timestamp = UNIX_TIMESTAMP(), 
        stripe_client_secret = '${stripeClientSecret}',
        stripe_payment_intent_id = '${stripePaymentIntentId}',
        stripe_tax_calculation_id = '${stripeTaxCalculationId}' 
      WHERE uid = ${orderId} AND customer_uid = ${userId};
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

export {
  getCompleteCountryList,
  getCountryCodeFromISO,
  getCompleteAmericanStateList,
  getAmericanStateCodeFromName,
  getCustomerContacts,
  getCustomerOrders,
  createCustomerContact,
  updateCustomerContact,
  getCompleteProductList,
  getProductByCode,
  getProductImageList,
  getProductPriceList,
  getCustomerPendingOrder,
  createCustomerOrder,
  updateCustomerOrder,
}
