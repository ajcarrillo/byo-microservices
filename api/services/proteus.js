import { check, validationResult } from 'express-validator'

import { removeHTMLTags } from '../sanitisers/input-sanitisers.js'
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
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Creates a new proteus controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const createProteusController = async (req, res, _next) => {
  await check('controllerName').not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)
  await check('controllerConfig').not().isEmpty().trim().customSanitizer(removeHTMLTags).run(req)

  const validationErr = validationResult(req)
  if (!validationErr.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: validationErr.array(),
    })
  }

  try {
    const response = await Proteus.newProteusController(
      req.user.uid,
      req.file.originalname,
      req.file.key,
      req.file.size.toString(),
      req.file.mimetype,
      req.body.controllerName,
      req.body.controllerConfig,
    )

    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { ...response },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

/**
 * Gets a list of proteus controllers for the gallery
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getProteusGalleryControllers = async (req, res, _next) => {
  try {
    const gallery = await Proteus.getProteusGalleryControllerList(req.user.uid)
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { gallery },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

export {
  createProteusController,
  getProteusGalleryControllers,
  getProteusSettings,
  heartbeat,
}
