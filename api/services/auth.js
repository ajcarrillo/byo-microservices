
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

export {
  heartbeat,
  getUniqueId,
  signIn,
}
