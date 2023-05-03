import logger from '../logger/index.js'
import { mysqlRealEscapeString } from '../lib/database-lib.js'
import {
  getUserIdByAddress,
  getUserImage,
  getUserProfileDetails,
} from './sql/user-sql.js'

/**
 * Gets a user profile details
 * @param {string} address The user address
 * @return {Promise} A user profile object
 */
const getUserProfile = (address) => {
  return new Promise(async (resolve, reject) => {
    const add = mysqlRealEscapeString(address)
    try {
      const userIdResult = await getUserIdByAddress(add)
      if (userIdResult.length > 0) {
        const profileResult = await getUserProfileDetails(userIdResult[0].uid)
        if (profileResult.length > 0) {
          // Images
          const cdn = process.env.CDN_USER_RESOURCES
          let bannerImage = null
          let avatarImage = null
          let bannerImageUrl = null
          let avatarImageUrl = null
          if (profileResult[0].avatar_image_address) {
            avatarImage = await getUserImage(profileResult[0].avatar_image_address)
            avatarImageUrl = `${cdn}${avatarImage[0].location.replace(/\\/g, '/')}/${avatarImage[0].stored_name}`
          } else {
            avatarImageUrl = `${cdn}/default-profile-avatar.png`
          }
          if (profileResult[0].banner_image_address) {
            bannerImage = await getUserImage(profileResult[0].banner_image_address)
            bannerImageUrl = `${cdn}${bannerImage[0].location.replace(/\\/g, '/')}/${bannerImage[0].stored_name}`
          } else {
            bannerImageUrl = `${cdn}/default-profile-banner.png`
          }

          const profile = {
            avatarImage: avatarImageUrl,
            bannerImage: bannerImageUrl,
            address,
            biography: profileResult[0].biography,
            name: profileResult[0].profile_name,
          }

          resolve(profile)
        } else {
          throw new Error('PROFILE_NOT_FOUND')
        }
      } else {
        throw new Error('USER_NOT_FOUND')
      }
    } catch (e) {
      logger.error(`user-profile-lib: Failed to get user profile with address ${address}: ${e}`)
      reject(new Error(e.message))
    }
  })
}

export {
  getUserProfile,
}
