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
  updateShopGroup,
  createShopProductImage,
  createShopProductFile,
  createShopProduct,
  updateShopProduct,
  getAdminOrders,
  getAdminOrdersByDateRange,
  updateOrderStatus,
  getAdminShopProduct,
} from '../services/shop.js'

// eslint-disable-next-line new-cap
const router = Router()

router.get('/', heartbeat)
router.get('/access', checkAuth, accessRequest)
router.get('/shop/orders', checkAuth, checkAdmin, getAdminOrders)
router.post('/shop/orders', checkAuth, checkAdmin, getAdminOrdersByDateRange)
router.post('/shop/order/status/update', checkAuth, checkAdmin, updateOrderStatus)
router.post(
  '/shop/group/new',
  checkAuth,
  checkAdmin,
  uploadImageShopGroup.single('shopGroupImage'),
  createShopGroup,
)
router.post(
  '/shop/group/update',
  checkAuth,
  checkAdmin,
  uploadImageShopGroup.single('shopGroupImage'),
  updateShopGroup,
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
router.post(
  '/shop/product/update',
  checkAuth,
  checkAdmin,
  updateShopProduct,
)
router.get(
  '/shop/product/:address',
  checkAuth,
  checkAdmin,
  getAdminShopProduct,
)

export default router
