import { check, validationResult } from 'express-validator'

import { removeHTMLTags } from '../sanitisers/input-sanitisers.js'
import * as Auth from '../../lib/auth-lib.js'

/**
 * Auth endpoint heartbeat
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const heartbeat = (_req, res, _next) => {
  res.status(200).json({
    status: 200,
    message: 'Auth endpoint',
  })
}

/**
 * Returns a unique ID
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getUniqueId = (_req, res, _next) => {
  Auth.createUniqueID((err, uid) => {
    if (err === null) {
      res.status(200).json({
        status: 200,
        message: 'OK',
        uid,
      })
    } else {
      res.status(422).json({
        status: 422,
        message: err,
      })
    }
  })
}

/**
 * Sign a user in using email and password, and return a JWT
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 * @return {Express.Response}
 */
const signIn = async (req, res, _next) => {
  await check('email').isEmail().run(req)
  await check('password').not().isEmpty().customSanitizer(removeHTMLTags).run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const user = await Auth.authoriseSignIn(req.body.email, req.body.password)

    // TODO: Implement secure tokens
    // res.cookie('access_token', token, {
    //   maxAge: 3600,
    //   httpOnly: true,
    //   secure: true
    // })
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: {
        token: user.token,
      },
    })
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: err.message,
    })
  }
}

/**
 * Sign a user in using email and password, and return a JWT
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 * @return {Express.Response}
 */
const signUp = async (req, res, _next) => {
  await check('password').isLength({ min: 8, max: 32 }).customSanitizer(removeHTMLTags).run(req)
  await check('email').isEmail().not().isEmpty().trim().run(req)
  await check('profileName').not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    await Auth.signUpNewUser(req.body.email, req.body.password, req.body.profileName)
    res.status(200).json({
      status: 200,
      message: 'SIGNUP_COMPLETE',
    })
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: err.message,
    })
  }
}

/**
 * Confirms a user's email address
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 * @return {Express.Response}
 */
const confirmEmail = async (req, res, _next) => {
  await check('confCode').isUUID().not().isEmpty().run(req)
  await check('email').isEmail().not().isEmpty().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    await Auth.confirmEmailAddress(req.body.email, req.body.confCode)
    res.status(200).json({
      status: 200,
      message: 'EMAIL_CONFIRMED',
    })
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: err.message,
    })
  }
}

/**
 * Resends a confirmation code to the user's email address
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 * @return {Express.Response}
 */
const resendConfirmEmail = async (req, res, _next) => {
  await check('password').isLength({ min: 8, max: 32 }).customSanitizer(removeHTMLTags).run(req)
  await check('email').isEmail().not().isEmpty().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const result = await Auth.resendEmailConfirmationEmail(req.body.email, req.body.password)
    res.status(200).json({
      status: 200,
      message: result,
    })
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: err.message,
    })
  }
}

/**
 * Sends an email with a passwords reset code
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 * @return {Express.Response}
 */
const requestPasswordReset = async (req, res, _next) => {
  await check('email').isEmail().not().isEmpty().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const result = await Auth.requestPasswordChange(req.body.email, req.body.password)
    res.status(200).json({
      status: 200,
      message: result,
    })
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: err.message,
    })
  }
}

/**
 * Changes a user's password
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 * @return {Express.Response}
 */
const changePassword = async (req, res, _next) => {
  await check('email').isEmail().not().isEmpty().run(req)
  await check('password').isLength({ min: 8, max: 32 }).customSanitizer(removeHTMLTags).run(req)
  await check('resetCode').isUUID().not().isEmpty().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const result = await Auth.changePassword(req.body.email, req.body.password, req.body.resetCode)
    res.status(200).json({
      status: 200,
      message: result,
    })
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: err.message,
    })
  }
}

export {
  changePassword,
  confirmEmail,
  heartbeat,
  getUniqueId,
  requestPasswordReset,
  resendConfirmEmail,
  signIn,
  signUp,
}
