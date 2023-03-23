import logger from '../logger/index.js'
import { getCompleteProductList, getProductImageList } from './sql/shop-sql.js'

/**
 * Returns all the shop products
 * @return {Promise}
 */
const getAllShopProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await getCompleteProductList()
      if (results.length > 0) {
        const products = []
        for (let p = 0; p < results.length; p++) {
          const imgList = results[p].product_image_addresses.split(',').join('","')
          const images = await getProductImageList(`"${imgList}"`)
          products.push({
            productAddress: results[p].address,
            productCode: results[p].product_code,
            productName: results[p].product_name,
            productDescription: results[p].product_description,
            productPrice: results[p].product_price,
            productImages: images.map((i) =>
              `${process.env.IMAGE_SERVER_DOMAIN}/${i.location.replace(/\\/g, '/')}${i.stored_name}`),
            productDispatchTime: results[p].product_dispatch_time,
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
 * Returns a customer's contact details
 * @return {Promise}
 */
const getCustomerContactDetails = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // const contacts = await getUserContactDetails()
      // if (contacts.length > 0) {
      //   resolve({
      //     userAddress: c[0].userAddress,
      //     userProfileName: c[0].profile_name,
      //     controllerAddress: c[0].address,
      //     image: `${process.env.IMAGE_SERVER_DOMAIN}/${c[0].location.replace(/\\/g, '/')}${c[0].stored_name}`,
      //     name: c[0].config_name,
      //     rating: resolveProteusControllerRating(maxRating, c[0].rating),
      //   })
      // } else {
      //   reject(new Error('NO_CONTACT_DETAILS_FOUND'))
      // }
    } catch (e) {
      logger.error(`shop-lib: Failed to get all shop products: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

export {
  getCustomerContactDetails,
  getAllShopProducts,
}
