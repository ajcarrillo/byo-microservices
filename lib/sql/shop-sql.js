import {
  dbSelect,
} from '../database-lib.js'

/**
 * Returns all the shop products
 * @return {Promise} An array of results
 */
const getCompleteProductList = () => {
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
 * Returns all the shop products
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

export {
  getCompleteProductList,
  getProductImageList,
}
