// import { check, validationResult } from 'express-validator'

// import { removeHTMLTags } from '../sanitisers/input-sanitisers.js'
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

export {
  getCustomerDetails,
  getCustomerOrders,
  getShopProducts,
  heartbeat,
}
