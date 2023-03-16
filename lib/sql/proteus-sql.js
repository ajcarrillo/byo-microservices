import {
  dbInsert,
  dbSelect,
} from '../database-lib.js'

/**
 * Creates a row in the users_proteus_settings table with default values
 * @param {number} uid The user_id
 * @return {Promise} An array of results
 */
const createApplicationSettings = (uid) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO users_proteus_settings (user_id) 
      VALUES (${uid});
    `
    try {
      const insertObj = await dbInsert(sql)
      if (insertObj.error === null && insertObj.insertID > 0) {
        const select = await getUserApplicationSettings(uid)
        if (select.length > 0) {
          resolve(select.results)
        } else {
          throw new Error('FAILED')
        }
      } else {
        throw new Error(insertObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Gets the Proteus application settings for the given user_id
 * @param {number} uid The user_id
 * @return {Promise} An array of results
 */
const getApplicationSettings = (uid) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      SELECT * 
      FROM users_proteus_settings  
      WHERE users_proteus_settings.user_id = ${uid};
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
 * Creates a row in the users_proteus_controllers table
 * @param {number} uid The user ID
 * @param {string} address A unique address for this controller
 * @param {string} imageAddress The image address
 * @param {string} cName The controller name
 * @param {string} cConfig A JSON string defining the controller config
 * @param {number} rating The rating - should be 0
 * @return {Promise<number>} The uid for the new controller
 */
const createProteusController = (uid, address, imageAddress, cName, cConfig, rating) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO users_proteus_controllers (user_id, address, image_address, config_name, config, rating) 
      VALUES (${uid}, '${address}', '${imageAddress}', '${cName}', '${cConfig}', ${rating});
    `
    try {
      const insertObj = await dbInsert(sql)
      if (insertObj.error === null && insertObj.insertID > 0) {
        resolve(insertObj.insertID)
      } else {
        throw new Error(insertObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Gets a single proteus controller by UID
 * @param {number} uid The user_id
 * @return {Promise} An array of results
 */
const getProteusControllerByUID = (uid) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT 
      users_proteus_controllers.config_name, 
      users_proteus_controllers.rating, 
      users_proteus_controllers.address, 
      users_proteus_controllers.user_id, 
      users_images.stored_name, users_images.location, 
      users_profiles.profile_name, 
      users.address AS userAddress 
    FROM users_proteus_controllers 
    INNER JOIN users_images   
      ON users_proteus_controllers.image_address = users_images.address
    INNER JOIN users_profiles 
      ON users_proteus_controllers.user_id = users_profiles.user_id 
    INNER JOIN users 
      ON users_proteus_controllers.user_id = users.uid
    WHERE users_proteus_controllers.uid = ${uid};
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
 * Gets a list of proteus controllers
 * @param {number} uid The user_id
 * @return {Promise} An array of results
 */
const getProteusControllers = () => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT 
      users_proteus_controllers.config_name, 
      users_proteus_controllers.rating, 
      users_proteus_controllers.address, 
      users_proteus_controllers.user_id, 
      users_images.stored_name, users_images.location, 
      users_profiles.profile_name, 
      users.address AS userAddress 
    FROM users_proteus_controllers 
    INNER JOIN users_images   
      ON users_proteus_controllers.image_address = users_images.address
    INNER JOIN users_profiles 
      ON users_proteus_controllers.user_id = users_profiles.user_id 
    INNER JOIN users 
      ON users_proteus_controllers.user_id = users.uid
    ORDER BY users_proteus_controllers.uid DESC 
    LIMIT 50;
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
 * Returns the highest rating
 * @return {Promise} An array of results
 */
const getProteusControllerMaxRating = () => {
  return new Promise(async (resolve, reject) => {
    const sql = `
    SELECT MAX(users_proteus_controllers.rating) AS highestRating 
    FROM users_proteus_controllers;
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
  createApplicationSettings,
  createProteusController,
  getApplicationSettings,
  getProteusControllers,
  getProteusControllerByUID,
  getProteusControllerMaxRating,
}
