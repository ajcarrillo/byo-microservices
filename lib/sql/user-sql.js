import { select } from '../database-lib.js'

/**
 * Returns a user by email address
 * @param {string} email Email address
 * @return {Promise} An array of results
 */
const getUserByEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    const sql = `SELECT 
    byowave_users.*, 
    byowave_users_settings.* 
    FROM byowave_users 
    INNER JOIN byowave_users_settings 
      ON byowave_users.uid = byowave_users_settings.user_uid 
    WHERE byowave_users.email_address = '${email}';`
    try {
      const resultObj = await select(sql)
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
  getUserByEmail,
}
