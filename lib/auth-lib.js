import uuid from 'node-uuid'
import jwt from 'jsonwebtoken'
import { compare, hash as _hash } from 'bcrypt'
import { randomBytes } from 'crypto'

import { getUserByEmail } from './sql/user-sql.js'

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
}
