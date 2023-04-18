import { Router } from 'express'

// eslint-disable-next-line no-unused-vars
import checkAuth from '../middleware/check-auth.js'
import {
  createSalesTransaction,
  getCountryList,
  getAmericanStatesList,
  getCustomerDetails,
  saveCustomerDetails,
  getCustomerOrders,
  getShopProducts,
  heartbeat,
} from '../services/shop.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)
router.get('/countries', getCountryList)
router.get('/american-states', getAmericanStatesList)
router.get('/products', getShopProducts)
router.get('/customer/details', checkAuth, getCustomerDetails)
router.post('/customer/details', checkAuth, saveCustomerDetails)
router.get('/customer/orders', checkAuth, getCustomerOrders)
router.post('/transaction/create', checkAuth, createSalesTransaction)

export default router
