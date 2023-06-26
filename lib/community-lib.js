import logger from '../logger/index.js'
import { getPostImageList, getPostList } from './sql/community-sql.js'
// import * as Auth from '../lib/auth-lib.js'
// import { mysqlRealEscapeString } from '../lib/database-lib.js'

/**
 * Returns a list of community posts
 * @return {Promise}
 */
const getCommunityPosts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await getPostList()
      if (results.length > 0) {
        const posts = []
        for (let p = 0; p < results.length; p++) {
          const imgList = JSON.parse(results[p].item_images)
          const imgAddresses = imgList.map((i) => i.address).split(',').join("','")
          const images = await getPostImageList(`'${imgAddresses}'`)
          posts.push({
            address: results[p].address,
            title: results[p].meta_title,
            description: results[p].meta_description,
            keywords: results[p].meta_keywords,
            body: results[p].body,
            images: imgList.map((iL) => {
              const imgName = images.find((iF) => iF.address === iL.address).stored_name
              return {
                address: iL.address,
                tag: iL.tag,
                url: `${process.env.CDN_COMMUNITY_RESOURCES}${i.location.replace(/\\/g, '/')}/${imgName}`,
              }
            }),
          })
        }
        resolve(posts)
      } else {
        resolve([])
      }
    } catch (e) {
      logger.error(`community-lib: Failed to get community posts: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

export {
  getCommunityPosts,
}
