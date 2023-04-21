import logger from '../logger/index.js'
import {
  createApplicationSettings,
  createProteusController,
  getApplicationSettings,
  getProteusControllers,
  getProteusControllerByUID,
  getProteusControllerMaxRating,
} from './sql/proteus-sql.js'
import { createNewUserImage } from './sql/user-sql.js'
import { mysqlRealEscapeString } from './database-lib.js'
import * as Auth from '../lib/auth-lib.js'
import { resolveProteusControllerRating } from '../utils/proteus-utils.js'

/**
 * Gets a user's Proteus application settings
 * @param {number} uid The user_id
 * @return {Promise} An object containing the Proteus application settings
 */
const getUserApplicationSettings = (uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const lookupSettings = await getApplicationSettings(uid)
      if (lookupSettings.length > 0) {
        resolve({
          firmwareVersion: lookupSettings[0].firmware_version,
          showHints: lookupSettings[0].show_hints,
          antiAliasing: lookupSettings[0].anti_aliasing,
          sixteenBit: lookupSettings[0].sixteen_bit_colour,
          gpuHighPerformance: lookupSettings[0].gpu_high_performance,
          multipass: lookupSettings[0].multipass_rendering,
          depthTesting: lookupSettings[0].depth_testing,
        })
      } else {
        const createSettings = await createApplicationSettings(uid)
        if (createSettings.length > 0) {
          resolve({
            firmwareVersion: createSettings[0].firmware_version,
            showHints: createSettings[0].show_hints,
            antiAliasing: createSettings[0].anti_aliasing,
            sixteenBit: createSettings[0].sixteen_bit_colour,
            gpuHighPerformance: createSettings[0].gpu_high_performance,
            multipass: createSettings[0].multipass_rendering,
            depthTesting: createSettings[0].depth_testing,
          })
        } else {
          reject(new Error('SETTINGS_NOT_FOUND'))
        }
      }
    } catch (e) {
      logger.error(`proteus-lib: Failed to get or create proteus application settings for user_id ${uid}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Creates a new proteus controller
 * @param {number} userId The user ID
 * @param {string} originalName The original name of the controller image
 * @param {string} filename The new file name for the controller image
 * @param {string} destination The location of the stored image
 * @param {string} size The image file size
 * @param {string} mimetype The image mime type
 * @param {string} controllerName The new controller name
 * @param {string} controllerConfig THe controller's module configuration as JSON
 * @return {Promise}
 */
const newProteusController = (
  userId,
  originalName,
  filename,
  destination,
  size,
  mimetype,
  controllerName,
  controllerConfig,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uid = await Auth.createUniqueID()
      const imgAddress = Auth.generateAddress(uid + filename)
      const contAddress = Auth.generateAddress(uid + controllerName)
      const origName = mysqlRealEscapeString(originalName)
      const fName = mysqlRealEscapeString(filename)
      const dest = mysqlRealEscapeString(destination)
      const cName = mysqlRealEscapeString(controllerName)
      const cConfig = mysqlRealEscapeString(controllerConfig)

      await createNewUserImage(imgAddress, origName, fName, mimetype, dest, size)
      const controllerUID = await createProteusController(userId, contAddress, imgAddress, cName, cConfig, 0)
      const controller = await getProteusController(controllerUID)
      resolve(controller)
    } catch (e) {
      logger.error(`proteus-lib: Failed to create proteus controller item for user_id ${userId}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns a list of proteus controllers for the gallery
 * @param {number} uid The user ID
 * @return {Promise}
 */
const getProteusGalleryControllerList = (uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const r = await getProteusControllerMaxRating()
      let maxRating
      if (r.length == 0) {
        maxRating = 0
      } else {
        maxRating = r[0].highestRating
      }
      const controllers = await getProteusControllers()
      const personal = controllers.filter((c) => c.user_id === uid)
      const community = controllers.filter((c) => c.user_id !== uid)
      resolve({
        personal: personal.map((c) => {
          return {
            userAddress: c.userAddress,
            userProfileName: c.profile_name,
            controllerAddress: c.address,
            image: `${process.env.CDN_USER_IMAGES}/${c.location.replace(/\\/g, '/')}${c.stored_name}`,
            name: c.config_name,
            rating: resolveProteusControllerRating(maxRating, c.rating),
          }
        }),
        community: community.map((c) => {
          return {
            userAddress: c.userAddress,
            userProfileName: c.profile_name,
            controllerAddress: c.address,
            image: `${process.env.CDN_USER_IMAGES}\\${c.location.replace(/\\/g, '/')}${c.stored_name}`,
            name: c.config_name,
            rating: resolveProteusControllerRating(maxRating, c.rating),
          }
        }),
      })
    } catch (e) {
      logger.error(`proteus-lib: Failed to get proteus controller list for user_id ${uid}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

/**
 * Returns a single controller by ID
 * @param {number} uid The controller ID
 * @return {Promise}
 */
const getProteusController = (uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const r = await getProteusControllerMaxRating()
      let maxRating
      if (r.length == 0) {
        maxRating = 0
      } else {
        maxRating = r[0].highestRating
      }
      const c = await getProteusControllerByUID(uid)
      if (c.length > 0) {
        resolve({
          userAddress: c[0].userAddress,
          userProfileName: c[0].profile_name,
          controllerAddress: c[0].address,
          image: `${process.env.CDN_USER_IMAGES}/${c[0].location.replace(/\\/g, '/')}${c[0].stored_name}`,
          name: c[0].config_name,
          rating: resolveProteusControllerRating(maxRating, c[0].rating),
        })
      } else {
        reject(new Error('CONTROLLER_NOT_FOUND'))
      }
    } catch (e) {
      logger.error(`proteus-lib: Failed to get proteus controller with uid ${uid}: ${e}`)
      reject(new Error('ERROR'))
    }
  })
}

export {
  newProteusController,
  getProteusController,
  getUserApplicationSettings,
  getProteusGalleryControllerList,
}
