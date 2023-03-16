import uuid from 'node-uuid'
import jwt from 'jsonwebtoken'
import { compare, hash as _hash } from 'bcrypt'
import { randomBytes, createHash } from 'crypto'

import logger from '../logger/index.js'
import { mysqlRealEscapeString } from './database-lib.js'
import { generateEmailContent, sendEmail } from './email-lib.js'
import {
  clearEmailConfirmCode,
  createNewUser,
  createNewUserSettings,
  createNewUserProfile,
  getUserByEmail,
  getUserIdByEmail,
  setPasswordResetCode,
  updateUserPassword,
} from './sql/user-sql.js'

const { v4 } = uuid
const { sign } = jwt

/**
 * Authorises sign-in credentials and returns a user object
 * @param {string} email Email address
 * @param {string} password Password
 * @return {Promise}
 */
const authoriseSignIn = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await getUserByEmail(email)

      if (results.length > 0) {
        if (results[0].email_confirmed === 0) {
          return reject(new Error('EMAIL_NOT_CONFIRMED'))
        }

        if (results[0].account_restricted === 1) {
          return reject(new Error('ACCOUNT_RESTRICTED'))
        }

        const authorised = await compare(password, results[0].password)
        if (authorised) {
          const token = generateAccessToken(results[0].uid, results[0].email_address, '1d')
          resolve({
            uid: results[0].uid,
            token,
            address: results[0].address,
            userName: {
              firstName: results[0].first_name || '',
              lastName: results[0].last_name || '',
            },
          })
        } else {
          return reject(new Error('NOT_AUTHORISED'))
        }
      } else {
        return reject(new Error('ACCOUNT_NOT_FOUND'))
      }
    } catch (e) {
      reject(new Error('ERROR'))
    }
  })
}

/**
 * SignUp a new user
 * @param {string} mail An email address
 * @param {string} password A password
 * @param {string} profileName A profile name
 * @param {string} accountType Account type disabled/ableBodied
 * @param {string} locale The browser locale code eg. en-GB
 * @return {Promise}
 */
const signUpNewUser = (mail, password, profileName, accountType, locale) => {
  return new Promise(async (resolve, reject) => {
    const email = mysqlRealEscapeString(mail)
    const pName = mysqlRealEscapeString(profileName)
    const disabled = accountType === 'disabled' ? 1 : 0

    const address = generateAddress(mail)
    const hash = await hashPassword(password)

    try {
      const lookup = await getUserIdByEmail(mail)
      if (lookup.length > 0) {
        return reject(new Error('SIGNUP_EMAIL_ALREADY_REGISTERED'))
      }

      const emailConfCode = await createUniqueID()
      const emailParams = {
        userName: profileName,
        url: `${process.env.URL_CONFIRM_EMAIL_ADDRESS}?emailConf=${emailConfCode}&email=${mail}`,
      }
      // TODO: Figure out language code - hardcoded to English for now
      const { htmlEmail, textEmail } = await generateEmailContent('confirm-email', locale.split('-')[0], emailParams)

      const userId = await createNewUser(address, email, hash, locale.split('-')[0], disabled)
      await createNewUserSettings(userId, emailConfCode)
      await createNewUserProfile(userId, pName)
      // TODO: Switch to AWS mailer
      await sendEmail(mail, htmlEmail.subject, htmlEmail.body, textEmail.body)
      resolve('COMPLETE')
    } catch (e) {
      logger.error(`auth-lib: Failed to signup new user with email address ${mail}: ${e}`)
      reject(e)
    }
  })
}

/**
 * Confirm's a user's email address
 * @param {string} mail An email address
 * @param {string} confCode A confirmation code
 * @return {Promise}
 */
const confirmEmailAddress = (mail, confCode) => {
  return new Promise(async (resolve, reject) => {
    const email = mysqlRealEscapeString(mail)

    try {
      const lookup = await getUserByEmail(email)
      if (lookup.length > 0) {
        if (lookup[0].email_confirmation_code === confCode) {
          const result = await clearEmailConfirmCode(lookup[0].uid)
          if (result === 1) {
            resolve('EMAIL_CONFIRMED')
          } else {
            reject(new Error('CONFIRM_FAILED'))
          }
        } else {
          if (lookup[0].email_confirmation_code === null) {
            reject(new Error('EMAIL_ALREADY_CONFIRMED'))
          } else {
            reject(new Error('CONFIRM_CODE_MISMATCH'))
          }
        }
      } else {
        reject(new Error('CONFIRM_FAILED'))
      }
    } catch (e) {
      logger.error(`auth-lib: Failed to confirm email address ${mail}: ${e}`)
      reject(e)
    }
  })
}

/**
 * Resends an email confirmation email
 * @param {string} email Email address
 * @param {string} password Password
 * @return {Promise}
 */
const resendEmailConfirmationEmail = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const lookup = await getUserByEmail(email)

      if (lookup.length === 0) {
        return reject(new Error('EMAIL_NOT_FOUND'))
      }

      if (lookup[0].email_confirmed === 1) {
        return reject(new Error('EMAIL_ALREADY_CONFIRMED'))
      }

      const authorised = await compare(password, lookup[0].password)
      if (authorised) {
        const emailParams = {
          userName: lookup[0].first_name || 'User',
          url: `${process.env.URL_CONFIRM_EMAIL_ADDRESS}?emailConf=${lookup[0].email_confirmation_code}&email=${email}`,
        }
        // TODO: Figure out language code - hardcoded to English for now
        const { htmlEmail, textEmail } = await generateEmailContent('confirm-email', 'en', emailParams)
        // TODO: Switch to AWS mailer
        await sendEmail(email, htmlEmail.subject, htmlEmail.body, textEmail.body)
        resolve('COMPLETE')
      } else {
        return reject(new Error('NOT_AUTHORISED'))
      }
    } catch (e) {
      logger.error(`auth-lib: Failed to resend confirmation email address ${email}: ${e}`)
      reject(e)
    }
  })
}

/**
 * Requests a password reset
 * @param {string} email Email address
 * @return {Promise}
 */
const requestPasswordChange = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const lookup = await getUserByEmail(email)
      if (lookup.length === 0) {
        return reject(new Error('EMAIL_NOT_FOUND'))
      }

      const passResetCode = await createUniqueID()

      // TODO: Figure out language code - hardcoded to English for now
      const emailParams = {
        userName: lookup[0].first_name || 'User',
        url: `${process.env.URL_RESET_PASSWORD}?resetCode=${passResetCode}&email=${email}`,
      }
      // TODO: Figure out language code - hardcoded to English for now
      const { htmlEmail, textEmail } = await generateEmailContent('password-reset', 'en', emailParams)

      await setPasswordResetCode(lookup[0].uid, passResetCode)

      // TODO: Switch to AWS mailer
      await sendEmail(email, htmlEmail.subject, htmlEmail.body, textEmail.body)
      resolve('COMPLETE')
    } catch (e) {
      logger.error(`auth-lib: Failed to create password reset request for email address ${email}: ${e}`)
      reject(e)
    }
  })
}

/**
 * Changes a user's password
 * @param {string} email Email address
 * @param {string} password The new password
 * @param {string} resetCode The password reset code
 * @return {Promise}
 */
const changePassword = (email, password, resetCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const lookup = await getUserByEmail(email)
      if (lookup.length === 0) {
        return reject(new Error('EMAIL_NOT_FOUND'))
      }

      if (lookup[0].password_reset_code === resetCode) {
        const hash = await hashPassword(password)
        await updateUserPassword(lookup[0].uid, hash)
        resolve('PASSWORD_CHANGED')
      } else {
        return reject(new Error('RESET_CODE_MISMATCH'))
      }
    } catch (e) {
      logger.error(`auth-lib: Failed to change password for email address ${email}: ${e}`)
      reject(e)
    }
  })
}

/**
 * Creates a hashed address from the given string
 * @param {string} str The string to create an address from
 * @return {string} The hashed address
 */
const generateAddress = (str) => {
  const shasum = createHash('sha1')
  shasum.update(str + Date.now().toString())
  return shasum.digest('hex')
}

/**
 * Creates a JWT and signs with secret key
 * @param {number} uid User ID
 * @param {string} email Email address
 * @param {string} expires Wxpiration time
 * @return {string} A JWT token
 */
const generateAccessToken = (uid, email, expires) => {
  const token = sign(
    {
      uid,
      email,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: expires,
    },
  )
  return token
}

/**
 * Hashes a plain text password
 * @param {string} pass Password to hash
 * @return {Promise}
 */
const hashPassword = (pass) => {
  return new Promise((resolve, reject) => {
    _hash(pass, 10, (err, hash) => {
      if (err) reject(err)
      else resolve(hash)
    })
  })
}

/**
 * Creates a unique ID
 * @return {Promise}
 */
const createUniqueID = () => {
  return new Promise((resolve, reject) => {
    createRandomBytes(40, (err, rB) => {
      if (!err) resolve(v4(rB))
      else reject(err)
    })
  })
}

/**
 * Creats a byte array of random characters
 * @param {number} len Length - max 40
 * @param {Function} cb Callback
 */
const createRandomBytes = (len, cb) => {
  if (randomBytes) {
    randomBytes(len, (err, byteArr) => {
      if (err) {
        cb(err)
      } else {
        cb(null, byteArr)
      }
    })
  } else {
    cb('CRYPTO_NOT_AVAILABLE')
  }
}

export {
  authoriseSignIn,
  changePassword,
  confirmEmailAddress,
  createUniqueID,
  generateAddress,
  generateAccessToken,
  hashPassword,
  signUpNewUser,
  requestPasswordChange,
  resendEmailConfirmationEmail,
}
