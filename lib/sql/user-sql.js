import {
  dbInsert,
  dbSelect,
  dbUpdate,
} from '../database-lib.js'

/**
 * Returns a user ID by email address
 * @param {string} email Email address
 * @return {Promise}
 */
const getUserIdByEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      SELECT 
      users.uid 
      FROM users 
      WHERE users.email_address = '${email}';
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
 * Returns a user settings by email address
 * @param {string} email Email address
 * @return {Promise} An array of results
 */
const getUserByEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      SELECT 
      users.*, 
      users_settings.* 
      FROM users 
      INNER JOIN users_settings 
        ON users.uid = users_settings.user_id 
      WHERE users.email_address = '${email}';
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
 * Creates a new user in the users table
 * @param {string} address A hashed address
 * @param {string} email Email address
 * @param {string} password An encrypted password
 * @return {Promise} A unique ID
 */
const createNewUser = (address, email, password) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO users (email_address, password, address) 
      VALUES ('${email}', '${password}', '${address}');
    `
    try {
      const resultObj = await dbInsert(sql)
      if (resultObj.error === null && resultObj.insertID > 0) {
        resolve(resultObj.insertID)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Creates a new user in the users_settings table
 * @param {number} userId The new user ID
 * @param {string} emailConfCode The email confirmation code
 * @return {Promise}
 */
const createNewUserSettings = (userId, emailConfCode) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO users_settings (user_id, email_confirmation_code) 
      VALUES (${userId}, '${emailConfCode}');
    `
    try {
      const resultObj = await dbInsert(sql)
      if (resultObj.error === null && resultObj.insertID > 0) {
        resolve(resultObj.insertID)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Creates a new user in the users_profiles table
 * @param {number} userId The new user ID
 * @param {string} profileName The profile name
 * @return {Promise}
 */
const createNewUserProfile = (userId, profileName) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      INSERT IGNORE INTO users_profiles (user_id, profile_name, achievement_codes) 
      VALUES (${userId}, '${profileName}', 'SUP');
    `
    try {
      const resultObj = await dbInsert(sql)
      if (resultObj.error === null && resultObj.insertID > 0) {
        resolve(resultObj.insertID)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Confirms a new user's email address in the users_settings table
 * @param {number} userId The new user ID
 * @return {Promise}
 */
const clearEmailConfirmCode = (userId) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      UPDATE users_settings 
      SET email_confirmed = 1, email_confirmation_code = null 
      WHERE uid = ${userId};
    `
    try {
      const resultObj = await dbUpdate(sql)
      if (resultObj.error === null && resultObj.changedRows > 0) {
        resolve(resultObj.changedRows)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Adds a password reset code to the users_settings table
 * @param {number} userId A user ID
 * @param {string} resetCode A UUID code
 * @return {Promise}
 */
const setPasswordResetCode = (userId, resetCode) => {
  return new Promise(async (resolve, reject) => {
    const sql = `
      UPDATE users_settings 
      SET password_reset_code = '${resetCode}' 
      WHERE uid = ${userId};
    `
    try {
      const resultObj = await dbUpdate(sql)
      if (resultObj.error === null && resultObj.changedRows > 0) {
        resolve(resultObj.changedRows)
      } else {
        throw new Error(resultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Updates a user's password
 * @param {number} userId A user ID
 * @param {*} passwordHash A hashed password
 * @return {Promise}
 */
const updateUserPassword = (userId, passwordHash) => {
  return new Promise(async (resolve, reject) => {
    const sqlSettings = `
      UPDATE users_settings 
      SET password_reset_code = null 
      WHERE uid = ${userId};
    `
    const sqlUser = `
      UPDATE users 
      SET password = '${passwordHash}' 
      WHERE uid = ${userId};
    `
    try {
      const settingsResultObj = await dbUpdate(sqlSettings)
      if (settingsResultObj.error === null && settingsResultObj.changedRows > 0) {
        const userResultObj = await dbUpdate(sqlUser)
        if (userResultObj.error === null && userResultObj.changedRows > 0) {
          resolve(userResultObj.changedRows)
        } else {
          throw new Error(userResultObj.error)
        }
      } else {
        throw new Error(settingsResultObj.error)
      }
    } catch (e) {
      reject(e)
    }
  })
}

export {
  clearEmailConfirmCode,
  createNewUser,
  createNewUserProfile,
  createNewUserSettings,
  getUserByEmail,
  getUserIdByEmail,
  setPasswordResetCode,
  updateUserPassword,
}
