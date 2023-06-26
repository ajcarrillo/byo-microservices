import { check, validationResult } from 'express-validator'

import { removeHTMLTags } from '../sanitisers/input-sanitisers.js'
import * as Auth from '../../lib/auth-lib.js'

/**
 * Admin endpoint heartbeat
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const heartbeat = (_req, res, _next) => {
  res.status(200).json({
    status: 200,
    message: 'Admin endpoint',
  })
}

/**
 * Returns true/false if user is admin
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const accessRequest = async (req, res, _next) => {
  try {
    const isAdmin = await Auth.isUserAdministrator(req.user.email)
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { isAdmin },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Adds a new post item
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const addNewPost = async (req, res, _next) => {
  await check('title').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('description').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('body').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('image01').not().isEmpty().customSanitizer(removeHTMLTags).run(req)
  await check('image02').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('image03').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('image04').optional({checkFalsy: true}).customSanitizer(removeHTMLTags).run(req)
  await check('status').custom((value) => {
    if (value === 'public' || value === 'private') {
      return true
    } else {
      return false
    }
  }).not().isEmpty().run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    await Shop.saveCustomerContactDetails(req.user.uid, req.body.contactDetails)
    const customer = await Shop.getCustomerContactDetails(req.user.uid)
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { customer },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

export {
  accessRequest,
  addNewPost,
  heartbeat,
}
