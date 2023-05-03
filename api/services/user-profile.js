import { param, validationResult } from 'express-validator'

// import { removeHTMLTags } from '../sanitisers/input-sanitisers.js'
import * as UserProfile from '../../lib/user-profile-lib.js'

/**
 * User Profile endpoint heartbeat
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const heartbeat = (_req, res, _next) => {
  res.status(200).json({
    status: 200,
    message: 'User Profile endpoint',
  })
}

/**
 * Creates a Stripe sales transaction
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getUserProfileDetails = async (req, res, _next) => {
  await param('address').isAlphanumeric().not().isEmpty().trim().escape().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const profile = await UserProfile.getUserProfile(req.params.address)

    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { profile },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

export {
  getUserProfileDetails,
  heartbeat,
}
