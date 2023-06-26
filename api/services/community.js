// import { check, validationResult } from 'express-validator'

// import { removeHTMLTags } from '../sanitisers/input-sanitisers.js'
import * as Community from '../../lib/community-lib.js'

/**
 * Community endpoint heartbeat
 * @param {Express.Request} _req
 * @param {Express.Response} res
 * @param {*} _next
 */
const heartbeat = (_req, res, _next) => {
  res.status(200).json({
    status: 200,
    message: 'Community endpoint',
  })
}

/**
 * Returns the community posts
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} _next
 */
const getPosts = async (req, res, _next) => {
  try {
    const posts = await Community.getCommunityPosts()
    res.status(200).json({
      status: 200,
      message: 'OK',
      data: { posts },
    })
  } catch (err) {
    res.status(422).json({
      status: 422,
      message: err.message,
    })
  }
}

export {
  getPosts,
  heartbeat,
}
