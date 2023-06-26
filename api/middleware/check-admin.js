import * as Auth from '../../lib/auth-lib.js'

/**
 * Ensures the request is from an admin user
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 * @return {Express.NextFunction | Express.Response}
 */
export default async (req, res, next) => {
  try {
    const isAdmin = await Auth.isUserAdministrator(req.user.email)
    if (isAdmin) {
      next()
    } else {
      throw new Error('NOT_ADMIN')
    }
  } catch (err) {
    return res.status(401).json({
      status: 401,
      message: err.message,
    })
  }
}
