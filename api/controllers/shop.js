import { Router } from 'express'

// eslint-disable-next-line no-unused-vars
import checkAuth from '../middleware/check-auth.js'
import {
  getCustomerDetails,
  getCustomerOrders,
  getShopProducts,
  heartbeat,
} from '../services/shop.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)
router.get('/products', getShopProducts)
router.get('/customer/details', checkAuth, getCustomerDetails)
router.get('/customer/orders', checkAuth, getCustomerOrders)

export default router
