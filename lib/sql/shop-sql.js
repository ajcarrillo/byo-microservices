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
 * Returns all the shop group products
 * @param {string} address The group address
 * @return {Promise} An array of results
 */
const getCompleteGoupProductList = (address) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * FROM shop_products WHERE product_group_addresses LIKE '%${address}%';
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
 * Returns all the shop products names
 * @return {Promise} An array of results
 */
const getCompleteProductNameList = () => {
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
 * Gets a shop product by product address
 * @param {*} address Product address
 * @return {Promise} A product
 */
const getProductByAddress = (address) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * FROM shop_products WHERE shop_products.address = '${address}';
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
 * Returns a products images
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
 * Returns a products file details if it exists
 * @param {string} code The product code
 * @return {Promise} The file details
 */
const getProductFile = (code) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT 
      shop_files.*,
      shop_products.product_file_address 
    FROM shop_files 
    INNER JOIN shop_products 
      ON shop_files.address = shop_products.product_file_address 
    WHERE shop_products.product_code = '${code}';
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
 * Returns a product file details
 * @param {string} address The file address
 * @return {Promise} The file details
 */
const getProductFileByAddress = (address) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * FROM shop_files 
    WHERE address = '${address}';
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
 * Returns all the shop groups
 * @return {Promise} An array of results
 */
const getCompleteGroupList = () => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * FROM shop_products_groups;
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
 * Returns a group image
 * @param {string} address Image address
 * @return {Promise} An array of results
 */
const getGroupImage = (address) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT 
      shop_images.stored_name, shop_images.location  
    FROM shop_images 
      WHERE shop_images.address = '${address}';
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
 * @param {string} rowStart The table row start
 * @param {string} limit The result limit
 * @return {Promise} An array of pending transactions
 */
const getCustomerOrders = (userId, rowStart, limit) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * 
    FROM shop_orders 
    WHERE shop_orders.customer_uid = ${userId} 
    ORDER BY shop_orders.uid DESC 
    ${rowStart && limit ? 'LIMIT ' + rowStart + ',' + limit : ''};
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
 * Returns all the total customer order count
 * @param {number} userId User ID
 * @return {Promise}
 */
const getCustomerOrdersCount = (userId) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT COUNT(*) AS total 
    FROM shop_orders 
    WHERE shop_orders.customer_uid = ${userId};
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
 * Returns an order by transaction ID
 * @param {string} transactionId Transaction ID
 * @return {Promise} The order details
 */
const getOrderByTransactionId = (transactionId) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * 
    FROM shop_orders 
    WHERE shop_orders.transaction_id = '${transactionId}';
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
 * Returns orders by order status
 * @param {string} rowStart The table row start
 * @param {string} limit The result limit
 * @param {string} status The order status
 * @return {Promise} The order list
 */
const getOrdersByOrderStatus = (rowStart, limit, status) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * 
    FROM shop_orders 
    WHERE shop_orders.order_status = '${status}' 
    ORDER BY uid DESC 
    LIMIT ${rowStart},${limit};
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
 * Returns the total number of rows by order status
 * @param {string} status The order status
 * @return {Promise}
 */
const getOrdersByOrderStatusCount = (status) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT COUNT(*) AS total  
    FROM shop_orders 
    WHERE shop_orders.order_status = '${status}';
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
 * Returns orders by payment status
 * @param {string} rowStart The table row start
 * @param {string} limit The result limit
 * @param {string} status The payment status
 * @return {Promise} The order list
 */
const getOrdersByPaymentStatus = (rowStart, limit, status) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * 
    FROM shop_orders 
    WHERE shop_orders.transaction_status = '${status}' 
    ORDER BY uid DESC 
    LIMIT ${rowStart},${limit};
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
 * Returns the total number of rows by payment status
 * @param {string} status The payment status
 * @return {Promise}
 */
const getOrdersByPaymentStatusCount = (status) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT COUNT(*) AS total 
    FROM shop_orders 
    WHERE shop_orders.transaction_status = '${status}';
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
 * Returns orders by date range
 * @param {number} startDate Start date as UNIX timestamp
 * @param {number} endDate End date as UNIX timestamp
 * @return {Promise} The order list
 */
const getOrdersByDateRange = (startDate, endDate) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * 
    FROM shop_orders 
    WHERE transaction_timestamp >= ${startDate} AND transaction_timestamp <= ${endDate} 
    ORDER BY uid ASC;
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
 * Updates an order's order status
 * @param {string} orderNumber The transaction ID
 * @param {string} status The order status
 * @return {Promise}
 */
const updateOrderOrderStatus = (orderNumber, status) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      UPDATE shop_orders 
      SET 
        order_status = '${status}'
      WHERE transaction_id = '${orderNumber}';
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
 * Creates a new sales order
 * @param {number} userId The user ID
 * @param {string} transactionId The transaction ID
 * @param {string} transactionSubtotal The subtotal cost
 * @param {string} transactionShipping The shipping cost
 * @param {string} transactionTax The tax cost
 * @param {string} transactionTotal The total cost
 * @param {string} basketItems JSON string of basket items
 * @param {string | null} salesTrackers JSON string of sales trackers
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
  salesTrackers,
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
        stripe_client_secret, stripe_payment_intent_id, stripe_tax_calculation_id, 
        sales_trackers
      ) 
      VALUES 
      (
        ${userId}, '${billingAddress}', '${shippingAddress}', '${basketItems}', 
        '${transactionSubtotal}', '${transactionShipping}', '${transactionTax}', '${transactionTotal}', 
        'processing', 'payment_requested', '${transactionId}', UNIX_TIMESTAMP(),
        '${stripeClientSecret}', '${stripePaymentIntentId}', '${stripeTaxCalculationId}', 
        ${!salesTrackers ? null : "'"+salesTrackers+"'"}
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
 * @param {string | null} salesTrackers JSON string of sales trackers
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
  salesTrackers,
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
        sales_trackers = ${!salesTrackers ? null : "'"+salesTrackers+"'"}, 
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

/**
 * Creates a new image in the shop_images table
 * @param {string} address A unique address
 * @param {string} origName The original file name
 * @param {string} storedName The saved file name
 * @param {string} mime Mime type
 * @param {string} location Stored location
 * @param {string} size File size
 * @return {Promise}
 */
const createNewShopImage = (address, origName, storedName, mime, location, size) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO shop_images (address, orig_name, stored_name, mime_type, location, size) 
      VALUES ('${address}', '${origName}', '${storedName}', '${mime}', '${location}', '${size}');
    `
    try {
      const resultObj = await dbInsert(sql)
      if (resultObj.error === null && resultObj.insertID > 0) {
        resolve(resultObj.insertID)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Creates a new file in the shop_files table
 * @param {string} address A unique address
 * @param {string} origName The original file name
 * @param {string} storedName The saved file name
 * @param {string} mime Mime type
 * @param {string} location Stored location
 * @param {string} size File size
 * @return {Promise}
 */
const createNewShopFile = (address, origName, storedName, mime, location, size) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO shop_files (address, orig_name, stored_name, mime_type, location, size) 
      VALUES ('${address}', '${origName}', '${storedName}', '${mime}', '${location}', '${size}');
    `
    try {
      const resultObj = await dbInsert(sql)
      if (resultObj.error === null && resultObj.insertID > 0) {
        resolve(resultObj.insertID)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Returns all the shop groups
 * @return {Promise} An array of results
 */
const getShopGroups = () => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * FROM shop_products_groups;
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
 * Creates a new shop group
 * @param {string} groupAddress Group address
 * @param {string} imgAddress Group image address
 * @param {string} gName Group name
 * @param {string} gDesc Group description
 * @return {Promise}
 */
const createNewShopGroup = (groupAddress, imgAddress, gName, gDesc) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO shop_products_groups (group_address, group_name, group_description, group_image_address) 
      VALUES ('${groupAddress}', '${gName}', '${gDesc}', '${imgAddress}');
    `
    try {
      const resultObj = await dbInsert(sql)
      if (resultObj.error === null && resultObj.insertID > 0) {
        resolve(resultObj.insertID)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Creates a new shop product in the shop_products table
 * @param {string} productAddress Product address
 * @param {string} metaTitle Meta title
 * @param {string} metaDescription Meta description
 * @param {string} metaKeywords Meta keywords
 * @param {string} productCode Product code
 * @param {string} productName Product name
 * @param {string} productDescription Prodcut description
 * @param {string} productPrice Product price
 * @param {string} productStockLevel Prodcut stock level
 * @param {string} productDispatchTime Product dispatch time
 * @param {string} productImages Product image addresses
 * @param {string} productGroups Product group addresses
 * @param {string} productFile Product file address
 * @return {Promise}
 */
const createNewShopProduct = (
  productAddress,
  metaTitle,
  metaDescription,
  metaKeywords,
  productCode,
  productName,
  productDescription,
  productPrice,
  productStockLevel,
  productDispatchTime,
  productImages,
  productGroups,
  productFile,
) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO shop_products (address, product_code, product_name, product_description, 
        product_price, product_image_addresses, product_dispatch_time, product_meta_title, 
        product_meta_description, product_meta_keywords, product_stock_level, product_group_addresses, 
        product_file_address) 
      VALUES ('${productAddress}', '${productCode}', '${productName}', '${productDescription}', 
        '${productPrice}', '${productImages}', '${productDispatchTime}', '${metaTitle}', '${metaDescription}',
        '${metaKeywords}', '${productStockLevel}', '${productGroups}', 
        ${productFile === '' ? null : "'"+productFile+"'"});
    `
    try {
      const resultObj = await dbInsert(sql)
      if (resultObj.error === null && resultObj.insertID > 0) {
        resolve(resultObj.insertID)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Updates a product's stock level
 * @param {string} productCode Product code
 * @param {number} stockLevel New stock level
 * @return {Promise}
 */
const updateProductStockLevel = (productCode, stockLevel) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      UPDATE shop_products 
      SET product_stock_level = '${stockLevel}' 
      WHERE product_code = '${productCode}';
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
  createNewShopImage,
  createNewShopFile,
  getShopGroups,
  createNewShopGroup,
  createNewShopProduct,
  getCompleteCountryList,
  getCountryCodeFromISO,
  getCompleteAmericanStateList,
  getAmericanStateCodeFromName,
  getCustomerContacts,
  createCustomerContact,
  updateCustomerContact,
  getCompleteGoupProductList,
  getCompleteProductNameList,
  getProductByCode,
  getProductByAddress,
  getProductImageList,
  getProductPriceList,
  getProductFile,
  getProductFileByAddress,
  getCompleteGroupList,
  getGroupImage,
  getOrderByTransactionId,
  getOrdersByOrderStatus,
  getOrdersByOrderStatusCount,
  getOrdersByDateRange,
  getOrdersByPaymentStatus,
  getOrdersByPaymentStatusCount,
  getCustomerOrders,
  getCustomerOrdersCount,
  getCustomerPendingOrder,
  createCustomerOrder,
  updateCustomerOrder,
  updateProductStockLevel,
  updateOrderOrderStatus,
}
