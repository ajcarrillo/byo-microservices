import { check, param, query, validationResult } from 'express-validator'

import { removeHTMLTags } from '../sanitisers/input-sanitisers.js'
import * as Shop from '../../lib/shop-lib.js'
import { updateOrderOrderStatus, getOrdersByDateRange } from '../../lib/sql/shop-sql.js'

/**
 * Shop endpoint heartbeat
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const heartbeat = (_req, res, _next) => {
  res.status(200).json({
    status: 200,
    message: 'Shop endpoint',
  })
}

/**
 * Returns the shop group products
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getShopGroupProducts = async (req, res, _next) => {
  await param('address').isAlphanumeric().not().isEmpty().trim().escape().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const products = await Shop.getAllShopGroupProducts(req.params.address)
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { products, groupAddress: req.params.address },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Returns a shop product by address
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getShopProduct = async (req, res, _next) => {
  await param('address').isAlphanumeric().not().isEmpty().trim().escape().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const product = await Shop.getShopProductByAddress(req.params.address)
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { product },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Returns the shop products names
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getShopProductsNames = async (_req, res, _next) => {
  try {
    const products = await Shop.getAllShopProductsNames()
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { products },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Returns the shop groups
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getShopGroups = async (_req, res, _next) => {
  try {
    const groups = await Shop.getAllShopGroups()
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { groups },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Returns a list of countries, currencies and codes
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getCountryList = async (req, res, _next) => {
  try {
    const countries = await Shop.getCountriesAndCurrencies()
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { countries },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Returns a list of American states
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getAmericanStatesList = async (req, res, _next) => {
  try {
    const states = await Shop.getAmericanStates()
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { states },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Returns the customer contact details
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getCustomerDetails = async (req, res, _next) => {
  try {
    const customer = await Shop.getCustomerContactDetails(req.user.uid)
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { customer },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Saves customer contact details
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const saveCustomerDetails = async (req, res, _next) => {
  await check('contactDetails.*.name').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[0].address').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[0].firstName').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[0].lastName').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[0].addressLine1').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[0].addressLine2').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[0].townCity').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[0].regionCounty').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[0].zipPostcode').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[0].countryCode').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[0].telephone').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[1].address').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[1].firstName').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[1].lastName').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[1].addressLine1').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[1].addressLine2').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[1].townCity').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[1].regionCounty').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[1].zipPostcode').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[1].countryCode').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('contactDetails[1].telephone').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    await Shop.saveCustomerContactDetails(req.user.uid, req.body.contactDetails)
    const customer = await Shop.getCustomerContactDetails(req.user.uid)
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { customer },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Returns the customer orders
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getCustomerOrders = async (req, res, _next) => {
  try {
    const orders = await Shop.getCustomerOrderList(req.user.uid)
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { orders },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Returns the requested orders for admin
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getAdminOrders = async (req, res, _next) => {
  await query('rowStart').isNumeric().not().isEmpty().trim().escape().run(req)
  await query('limit').isNumeric().not().isEmpty().trim().escape().run(req)
  await query('searchText').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('searchType').custom((value) => {
    if (value === 'order' || value === 'email' || value === 'processing' || value === 'declined') {
      return true
    } else {
      return false
    }
  }).not().isEmpty().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const results = await Shop.getAdminOrderList(
      req.query.rowStart,
      req.query.limit,
      req.query.searchType,
      req.query.searchText,
    )
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: {
        limit: req.query.limit,
        total: results.total,
        orders: results.orders,
      },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Returns the requested orders by date range for admin
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getAdminOrdersByDateRange = async (req, res, _next) => {
  await check('startDate').isISO8601().not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)
  await check('endDate').isISO8601().not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const startDate = new Date(req.body.startDate)
    const endDate = new Date(req.body.endDate)

    const orders = await getOrdersByDateRange(
      Math.floor(startDate.getTime() / 1000),
      Math.floor(endDate.getTime() / 1000),
    )
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: {orders},
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Updates an order's status
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const updateOrderStatus = async (req, res, _next) => {
  await check('orderNumber').isAlphanumeric().not().isEmpty().trim().escape().run(req)
  await check('orderStatus').custom((value) => {
    if (value === 'processing' || value === 'dispatched' || value === 'returned' || value === 'refunded') {
      return true
    } else {
      return false
    }
  }).not().isEmpty().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    await updateOrderOrderStatus(
      req.body.orderNumber,
      req.body.orderStatus,
    )
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: {orderNumber: req.body.orderNumber, orderStatus: req.body.orderStatus},
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Creates a Stripe sales transaction
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const createSalesTransaction = async (req, res, _next) => {
  await check('basket.*.productAmount').not().isEmpty().isInt().run(req)
  await check('basket.*.productCode').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('deliveryAddress').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('stripeClientSecret').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const transaction = await Shop.createNewSalesTransaction(
      req.user.uid,
      req.user.address,
      req.body.basket,
      req.body.deliveryAddress,
      req.body.stripeClientSecret,
    )

    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { transaction },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Creates a shop group
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const createShopGroup = async (req, res, _next) => {
  await check('name').not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)
  await check('description').not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const response = await Shop.newShopGroup(
      req.file.originalname,
      req.file.key,
      req.file.size.toString(),
      req.file.mimetype,
      req.body.name,
      req.body.description,
    )

    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { ...response },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Creates a shop product
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const createShopProduct = async (req, res, _next) => {
  await check('metaTitle').isLength({ min: 1, max: 128 }).customSanitizer(removeHTMLTags).run(req)
  await check('metaDescription').isLength({ min: 1, max: 256 }).customSanitizer(removeHTMLTags).run(req)
  await check('metaKeywords').isLength({ min: 1, max: 256 }).customSanitizer(removeHTMLTags).run(req)
  await check('productCode').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('productName').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('productDescription').isLength({ min: 1, max: 1000 }).run(req)
  await check('productPrice').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('productStockLevel').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('productDispatchTime').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('productImages').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('productGroups').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('productFile').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    await Shop.newShopProduct(
      req.body.metaTitle,
      req.body.metaDescription,
      req.body.metaKeywords,
      req.body.productCode,
      req.body.productName,
      req.body.productDescription,
      req.body.productPrice,
      req.body.productStockLevel,
      req.body.productDispatchTime,
      req.body.productImages,
      req.body.productGroups,
      req.body.productFile,
    )

    res.status(200).json({
      status: 200,
      message: 'OK',
      data: {},
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Creates a shop product image
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const createShopProductImage = async (req, res, _next) => {
  try {
    const response = await Shop.newShopProductImage(
      req.file.originalname,
      req.file.key,
      req.file.size.toString(),
      req.file.mimetype,
    )

    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { address: response },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Creates a shop product file
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const createShopProductFile = async (req, res, _next) => {
  try {
    const response = await Shop.newShopProductFile(
      req.file.originalname,
      req.file.key,
      req.file.size.toString(),
      req.file.mimetype,
    )

    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { address: response },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

export {
  createShopProduct,
  createShopProductImage,
  createShopProductFile,
  createShopGroup,
  createSalesTransaction,
  getCountryList,
  getAmericanStatesList,
  getCustomerDetails,
  saveCustomerDetails,
  getAdminOrders,
  getAdminOrdersByDateRange,
  getCustomerOrders,
  getShopGroupProducts,
  getShopProductsNames,
  getShopProduct,
  getShopGroups,
  heartbeat,
  updateOrderStatus,
}
