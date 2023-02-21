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
      INSERT IGNORE INTO  users_proteus_settings (user_id) 
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

export {
  createApplicationSettings,
  getApplicationSettings,
}
