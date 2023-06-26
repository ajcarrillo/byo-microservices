import { Router } from 'express'

import checkAuth from '../middleware/check-auth.js'
import checkAdmin from '../middleware/check-admin.js'
import uploadImageShopGroup from '../middleware/upload-image-shop-group.js'
import uploadImageShopProduct from '../middleware/upload-image-shop-product.js'
import uploadFileShopProduct from '../middleware/upload-file-shop-product.js'
import {
  accessRequest,
  heartbeat,
} from '../services/admin.js'
import {
  createShopGroup,
  createShopProductImage,
  createShopProductFile,
  createShopProduct,
  getAdminOrders,
  getAdminOrdersByDateRange,
  updateOrderStatus,
} from '../services/shop.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)
router.get('/access', checkAuth, accessRequest)
router.get('/shop/orders', checkAuth, checkAdmin, getAdminOrders)
router.post('/shop/orders', checkAuth, checkAdmin, getAdminOrdersByDateRange)
router.post('/shop/order/status/update', checkAuth, checkAdmin, updateOrderStatus)
router.post(
  '/shop/new-group',
  checkAuth,
  checkAdmin,
  uploadImageShopGroup.single('shopGroupImage'),
  createShopGroup,
)
router.post(
  '/shop/product/image/upload',
  checkAuth,
  checkAdmin,
  uploadImageShopProduct.single('productImage'),
  createShopProductImage,
)
router.post(
  '/shop/product/file/upload',
  checkAuth,
  checkAdmin,
  uploadFileShopProduct.single('productFile'),
  createShopProductFile,
)
router.post(
  '/shop/product/new',
  checkAuth,
  checkAdmin,
  createShopProduct,
)

export default router
