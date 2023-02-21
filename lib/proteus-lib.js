import logger from '../logger/index.js'
import { createApplicationSettings, getApplicationSettings } from './sql/proteus-sql.js'

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

export {
  getUserApplicationSettings,
}
