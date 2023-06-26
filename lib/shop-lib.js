import logger from '../logger/index.js'
import * as Auth from '../lib/auth-lib.js'
import * as Financial from '../lib/financial-lib.js'
import { mysqlRealEscapeString } from '../lib/database-lib.js'
import { deleteBucketItem } from '../lib/cdn-lib.js'
import {
  stripeCalculateSalesTax,
  stripeCreatePaymentIntent,
  stripeUpdatePaymentIntent,
  stripeToFloatPriceConversion,
} from '../lib/stripe-lib.js'
import { updateUserName, getUserByEmail } from './sql/user-sql.js'
import {
  createNewShopGroup,
  createNewShopProduct,
  getShopGroups,
  createNewShopImage,
  createNewShopFile,
  getCompleteCountryList,
  getCompleteAmericanStateList,
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
  getCompleteGroupList,
  getGroupImage,
  getCustomerPendingOrder,
  getOrderByTransactionId,
  getOrdersByOrderStatus,
  getOrdersByOrderStatusCount,
  getOrdersByPaymentStatus,
  getOrdersByPaymentStatusCount,
  getCustomerOrders,
  getCustomerOrdersCount,
  createCustomerOrder,
  updateCustomerOrder,
  updateProductStockLevel,
} from './sql/shop-sql.js'
import {
  resolveShopOrderStatus,
  resolveShopPaymentStatus,
} from '../utils/shop-utils.js'

/**
 * Returns all the shop group products
 * @param {string} address The group address
 * @return {Promise}
 */
const getAllShopGroupProducts = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await getCompleteGoupProductList(address)
      if (results.length > 0) {
        const products = []
        for (let p = 0; p < results.length; p++) {
          const imgList = results[p].product_image_addresses.split(',').join("','")
          const images = await getProductImageList(`'${imgList}'`)
          products.push({
            productAddress: results[p].address,
            productMetaTitle: results[p].product_meta_title,
            productMetaDescription: results[p].product_meta_description,
            productMetaKeywords: results[p].product_meta_keywords,
            productCode: results[p].product_code,
            productName: results[p].product_name,
            productDescription: results[p].product_description,
            productPrice: results[p].product_price,
            productImages: images.map((i) =>
              `${process.env.CDN_SHOP_RESOURCES}${i.location.replace(/\\/g, '/')}/${i.stored_name}`),
            productDispatchTime: results[p].product_dispatch_time,
            productStockLevel: results[p].product_stock_level,
            productGroups: results[p].product_group_addresses.split(','),
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
 * Returns all the shop products names
 * @return {Promise}
 */
const getAllShopProductsNames = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await getCompleteProductNameList()
      if (results.length > 0) {
        const products = []
        for (let p = 0; p < results.length; p++) {
          products.push({
            productAddress: results[p].address,
            productName: results[p].product_name,
            productCode: results[p].product_code,
          })
        }
        resolve(products)
      } else {
        resolve([])
      }
    } catch (e) {
      logger.error(`shop-lib: Failed to get all shop products name list: ${e}`)
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
        const imgList = results[0].product_image_addresses.split(',').join("','")
        const images = await getProductImageList(`'${imgList}'`)
        const product = {
          productAddress: results[0].address,
          productMetaTitle: results[0].product_meta_title,
          productMetaDescription: results[0].product_meta_description,
          productMetaKeywords: results[0].product_meta_keywords,
          productCode: results[0].product_code,
          productName: results[0].product_name,
          productDescription: results[0].product_description,
          productPrice: results[0].product_price,
          productImages: images.map((i) =>
            `${process.env.CDN_SHOP_RESOURCES}${i.location.replace(/\\/g, '/')}/${i.stored_name}`),
          productDispatchTime: results[0].product_dispatch_time,
          productStockLevel: results[0].product_stock_level,
          productGroups: results[0].product_group_addresses.split(','),
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
 * Returns a shop product by address
 * @param {*} address The product address
 * @return {Promise} A product object
 */
const getShopProductByAddress = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await getProductByAddress(address)
      if (results.length > 0) {
        const imgList = results[0].product_image_addresses.split(',').join("','")
        const images = await getProductImageList(`'${imgList}'`)
        const product = {
          productAddress: results[0].address,
          productMetaTitle: results[0].product_meta_title,
          productMetaDescription: results[0].product_meta_description,
          productMetaKeywords: results[0].product_meta_keywords,
          productCode: results[0].product_code,
          productName: results[0].product_name,
          productDescription: results[0].product_description,
          productPrice: results[0].product_price,
          productImages: images.map((i) =>
            `${process.env.CDN_SHOP_RESOURCES}${i.location.replace(/\\/g, '/')}/${i.stored_name}`),
          productDispatchTime: results[0].product_dispatch_time,
          productStockLevel: results[0].product_stock_level,
          productGroups: results[0].product_group_addresses.split(','),
        }
        resolve(product)
      } else {
        resolve(null)
      }
    } catch (e) {
      logger.error(`shop-lib: Failed to get shop product with product address ${address}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns all the shop groups
 * @return {Promise}
 */
const getAllShopGroups = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await getCompleteGroupList()
      if (results.length > 0) {
        const groups = []
        for (let p = 0; p < results.length; p++) {
          const image = await getGroupImage(results[p].group_image_address)
          groups.push({
            groupAddress: results[p].group_address,
            groupName: results[p].group_name,
            groupDescription: results[p].group_description,
            // eslint-disable-next-line max-len
            groupImage: `${process.env.CDN_SHOP_RESOURCES}${image[0].location.replace(/\\/g, '/')}/${image[0].stored_name}`,
          })
        }
        resolve(groups)
      } else {
        resolve([])
      }
    } catch (e) {
      logger.error(`shop-lib: Failed to get all shop groups: ${e}`)
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
          const digitalFile = await getProductFile(basketItems[p].productCode)
          const product = await getShopProductByCode(basketItems[p].productCode)

          product.amount = basketItems[p].productAmount
          if (digitalFile.length > 0) {
            product.fileAddress = digitalFile[0].address
          }
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
      const shippingCostPerItem = '5.00'
      const itemCosts = []
      let productFile
      for (let i = 0; i < itemList.length; i++) {
        productFile = await getProductFile(itemList[i].productCode)
        if (productFile.length === 0) { // Physical product
          itemCosts.push(Financial.multiplyFloatValues(shippingCostPerItem, itemList[i].productAmount))
        }
      }
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
      const codes = basketItems.map((bI) => bI.productCode).join("','")
      const priceList = await getProductPriceList(`'${codes}'`)

      // Collect any sales trackers from the basket
      const salesTrackers = []
      basketItems.forEach((bI) => {
        if (bI.trackers && bI.trackers.length > 0) {
          for (let sT = 0; sT < bI.trackers.length; sT++) {
            salesTrackers.push({
              product: bI.productCode,
              type: bI.trackers[sT].trackerType,
              code: bI.trackers[sT].trackerCode,
            })
          }
        }
      })
      console.log(salesTrackers)
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
          salesTrackers.length > 0 ? mysqlRealEscapeString(JSON.stringify(salesTrackers)) : null,
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
          salesTrackers.length > 0 ? mysqlRealEscapeString(JSON.stringify(salesTrackers)) : null,
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

/**
 * Creates a new shop group
 * @param {string} originalName The original name of the image
 * @param {string} key The new file name and folder for the image
 * @param {string} size The image file size
 * @param {string} mimetype The image mime type
 * @param {string} groupName The new group name
 * @param {string} groupDescription The group description
 * @return {Promise}
 */
const newShopGroup = (
  originalName,
  key,
  size,
  mimetype,
  groupName,
  groupDescription,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const keyParts = key.split('/')
      const filename = keyParts[keyParts.length-1]

      const uid = await Auth.createUniqueID()
      const imgAddress = Auth.generateAddress(uid + filename)
      const groupAddress = Auth.generateAddress(uid + groupName)
      const origName = mysqlRealEscapeString(originalName)
      const fName = mysqlRealEscapeString(filename)
      const dest = mysqlRealEscapeString(`/${process.env.SHOP_BUCKET_GROUP_IMAGES_FOLDER}`)
      const gName = mysqlRealEscapeString(groupName)
      const gDesc = mysqlRealEscapeString(groupDescription)

      const shopGroups = await getShopGroups()
      if (shopGroups.some((g) => g.group_name === gName)) {
        await deleteBucketItem(
          process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_ENDPOINT,
          process.env.BYOWAVE_RESOURCES_SHOP_BUCKET_NAME,
          key,
        )
        reject(new Error('DUPLICATE_NAME'))
      } else {
        await createNewShopImage(imgAddress, origName, fName, mimetype, dest, size)
        const controllerUID = await createNewShopGroup(groupAddress, imgAddress, gName, gDesc)
        resolve(controllerUID)
      }
    } catch (e) {
      logger.error(`shop-lib: Failed to create new shop group with name ${groupName}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Creates a new shop product
 * @param {string} metaTitle Meta ttile
 * @param {string} metaDescription Meta description
 * @param {string} metaKeywords Meta keywords
 * @param {string} productCode Product code
 * @param {string} productName Product name
 * @param {string} productDescription Product description
 * @param {string} productPrice Product price
 * @param {string} productStockLevel Product stock level
 * @param {string} productDispatchTime Product dispatch time
 * @param {string} productImages Product image addresses
 * @param {string} productGroups Product group addresses
 * @param {string} productFile Product file address
 * @return {Promise}
 */
const newShopProduct = (
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
    try {
      const uid = await Auth.createUniqueID()
      const pAddress = Auth.generateAddress(uid + productName)
      const mTitle = mysqlRealEscapeString(metaTitle)
      const mDesc = mysqlRealEscapeString(metaDescription)
      const mKey = mysqlRealEscapeString(metaKeywords)
      const pCode = mysqlRealEscapeString(productCode)
      const pName = mysqlRealEscapeString(productName)
      const pDesc = mysqlRealEscapeString(productDescription)
      const pPrice = mysqlRealEscapeString(productPrice)
      const pStock = mysqlRealEscapeString(productStockLevel)
      const pDisp = mysqlRealEscapeString(productDispatchTime)
      const pImg = mysqlRealEscapeString(productImages)
      const pGrp = mysqlRealEscapeString(productGroups)
      const pFile = productFile ? mysqlRealEscapeString(productFile) : ''

      const existing = await getProductByCode(pCode)
      if (existing.length > 0 ) {
        reject(new Error('DUPLICATE_CODE'))
      } else {
        const productUID = await createNewShopProduct(
          pAddress,
          mTitle,
          mDesc,
          mKey,
          pCode,
          pName,
          pDesc,
          pPrice,
          pStock,
          pDisp,
          pImg,
          pGrp,
          pFile,
        )
        resolve(productUID)
      }
    } catch (e) {
      logger.error(`shop-lib: Failed to create new shop product with code ${pCode}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Creates a new shop product image
 * @param {string} originalName The original name of the image
 * @param {string} key The new file name and folder for the image
 * @param {string} size The image file size
 * @param {string} mimetype The image mime type
 * @return {Promise}
 */
const newShopProductImage = (
  originalName,
  key,
  size,
  mimetype,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const keyParts = key.split('/')
      const filename = keyParts[keyParts.length-1]

      const uid = await Auth.createUniqueID()
      const imgAddress = Auth.generateAddress(uid + filename)
      const origName = mysqlRealEscapeString(originalName)
      const fName = mysqlRealEscapeString(filename)
      const dest = mysqlRealEscapeString(`/${process.env.SHOP_BUCKET_PRODUCT_IMAGES_FOLDER}`)

      await createNewShopImage(imgAddress, origName, fName, mimetype, dest, size)
      resolve(imgAddress)
    } catch (e) {
      logger.error(`shop-lib: Failed to create new shop image with name ${origName}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Creates a new shop product file
 * @param {string} originalName The original name of the file
 * @param {string} key The new file name and folder for the file
 * @param {string} size The file size
 * @param {string} mimetype The file mime type
 * @return {Promise}
 */
const newShopProductFile = (
  originalName,
  key,
  size,
  mimetype,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const keyParts = key.split('/')
      const filename = keyParts[keyParts.length-1]

      const uid = await Auth.createUniqueID()
      const imgAddress = Auth.generateAddress(uid + filename)
      const origName = mysqlRealEscapeString(originalName)
      const fName = mysqlRealEscapeString(filename)
      const dest = mysqlRealEscapeString(`/${process.env.SHOP_BUCKET_PRODUCT_FILES_FOLDER}`)

      await createNewShopFile(imgAddress, origName, fName, mimetype, dest, size)
      resolve(imgAddress)
    } catch (e) {
      logger.error(`shop-lib: Failed to create new shop file with name ${origName}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Processes any post-purchase events
 * @param {string} transactionId The order transaction ID
 * @return {Promise}
 */
const processPostPurchaseEvents = (transactionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await getOrderByTransactionId(transactionId)
      if (order.length > 0) {
        const orderItems = JSON.parse(order[0].order_items)
        let product
        let productFile
        for (let oI = 0; oI < orderItems.length; oI++) {
          productFile = await getProductFile(orderItems[oI].productCode)
          if (productFile.length > 0) {
            // A digital product
          } else {
            // A physical product
            product = await getProductByCode(orderItems[oI].productCode)
            const stockReductionAmount = parseInt(orderItems[oI].productAmount)
            const currentStockLevel = parseInt(product[0].product_stock_level)
            const newStockLevel = currentStockLevel - stockReductionAmount
            await updateProductStockLevel(orderItems[oI].productCode, newStockLevel < 0 ? 0 : newStockLevel)
          }
        }
        resolve('DONE')
      } else {
        throw new Error('ORDER_NOT_FOUND')
      }
    } catch (e) {
      logger.error(`shop-lib: Failed to process post-purchase with transaction ID ${transactionId}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns a list of orders for admin
 * @param {string} rowStart The SQL row
 * @param {string} limit The SQL limit
 * @param {string} searchType The type of search
 * @param {string} searchText Optional search text
 * @return {Promise} Array of orders
 */
const getAdminOrderList = (rowStart, limit, searchType, searchText) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orders = []
      let total = []
      switch (searchType) {
      case 'processing':
        orders = await getOrdersByOrderStatus(rowStart, limit, 'processing')
        total = await getOrdersByOrderStatusCount('processing')
        break
      case 'declined':
        orders = await getOrdersByPaymentStatus(rowStart, limit, 'payment_failed')
        total = await getOrdersByPaymentStatusCount('payment_failed')
        break
      case 'order':
        orders = await getOrderByTransactionId(searchText)
        total.push({total: orders.length})
        break
      case 'email':
        const user = await getUserByEmail(searchText)
        if (user.length > 0) {
          orders = await getCustomerOrders(user[0].uid, rowStart, limit)
          total = await getCustomerOrdersCount(user[0].uid)
        } else {
          total.push({total: 0})
        }
        break
      }
      resolve({orders, total: total[0].total})
    } catch (e) {
      logger.error(`shop-lib: Failed to get admin orders for search type ${searchType}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

export {
  newShopGroup,
  newShopProduct,
  newShopProductImage,
  newShopProductFile,
  createNewSalesTransaction,
  getCountriesAndCurrencies,
  getAmericanStates,
  getCustomerContactDetails,
  getCustomerOrderList,
  getAdminOrderList,
  getSalesShippingCosts,
  saveCustomerContactDetails,
  getAllShopGroupProducts,
  getAllShopProductsNames,
  getShopProductByAddress,
  getAllShopGroups,
  processPostPurchaseEvents,
}
