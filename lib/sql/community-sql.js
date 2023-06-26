import {
  dbSelect,
} from '../database-lib.js'

/**
* Returns a post's images
* @param {string} addresses A comma separated list of image addresses
* @return {Promise} An array of results
*/
const getPostImageList = (addresses) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT 
    community_feed_images.stored_name, community_feed_images.location  
    FROM community_feed_images 
      WHERE community_feed_images.address IN (${addresses});
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
 * Gets a list of news posts
 * @return {Promise} An array of results
 */
const getPostList = () => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT * 
    FROM community_feed 
    WHERE community_feed.item_type = 'news' 
    ORDER BY community_feed.uid DESC 
    LIMIT 10;
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
  getPostList,
  getPostImageList,
}
