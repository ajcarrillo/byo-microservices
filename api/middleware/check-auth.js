import { verify } from 'jsonwebtoken'

/**
 * Adds a user object from the decoded token, to the request object
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 * @return {Express.NextFunction | Express.Response}
 */
export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = verify(token, process.env.JWT_SECRET_KEY)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({
      status: 401,
      message: 'NOT_AUTHORISED',
    })
  }
}
