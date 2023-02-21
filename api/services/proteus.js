// import { check, validationResult } from 'express-validator'

// import { removeHTMLTags } from '../sanitisers/input-sanitisers.js'
import * as Proteus from '../../lib/proteus-lib.js'

/**
 * Auth endpoint heartbeat
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const heartbeat = (_req, res, _next) => {
  res.status(200).json({
    status: 200,
    message: 'Proteus endpoint',
  })
}

/**
 * Returns a a user's application settings
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getProteusSettings = async (req, res, _next) => {
  try {
    const settings = await Proteus.getUserApplicationSettings(req.user.uid)
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { settings },
    })
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: err.message,
    })
  }
}

export {
  getProteusSettings,
  heartbeat,
}
