import { check, validationResult } from 'express-validator'

import { removeHTMLTags } from '../sanitisers/input-sanitisers.js'
import * as Shop from '../../lib/shop-lib.js'

/**
 * Auth endpoint heartbeat
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
 * Returns the shop products
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getShopProducts = async (_req, res, _next) => {
  try {
    const products = await Shop.getAllShopProducts()
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

export {
  createSalesTransaction,
  getCountryList,
  getAmericanStatesList,
  getCustomerDetails,
  saveCustomerDetails,
  getCustomerOrders,
  getShopProducts,
  heartbeat,
}
