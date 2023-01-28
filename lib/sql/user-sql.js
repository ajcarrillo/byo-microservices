import { select } from '../database-lib.js'

/**
 * Returns a user by email address
 * @param {string} email Email address
 * @return {Promise} An array of results
 */
const getUserByEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    const sql = `SELECT 
    iyango_users.*, 
    iyango_users_settings.* 
    FROM iyango_users 
    INNER JOIN iyango_users_settings 
      ON iyango_users.uid = iyango_users_settings.uid 
    WHERE iyango_users.email_address = '${email}';`
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
