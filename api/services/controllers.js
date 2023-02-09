// import { check, validationResult } from 'express-validator'

// import { removeHTMLTags } from '../sanitisers/input-sanitisers.js'
import * as Controller from '../../lib/controller-lib.js'

/**
 * Auth endpoint heartbeat
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const heartbeat = (_req, res, _next) => {
  res.status(200).json({
    status: 200,
    message: 'Controllers endpoint',
  })
}

/**
 * Returns a list of controller modules
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getModuleList = async (_req, res, _next) => {
  try {
    const modules = await Controller.getControllerModules()
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { version: '0.1.0', modules },
    })
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: err.message,
    })
  }
}

export {
  getModuleList,
  heartbeat,
}
