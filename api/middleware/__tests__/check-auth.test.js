import { jest } from '@jest/globals'

import checkAuth from '../check-auth'
import { generateAccessToken } from '../../../lib/auth-lib'

describe('user-sql', () => {
  beforeEach(() => {

  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
    jest.resetModules()
  })

  test('should fail with a bad token', async () => {
    const mockRequest = (authHeader, sessionData) => ({
      headers: { authorization: authHeader },
      session: { data: sessionData },
    })

    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }

    const req = mockRequest('Bearer bad-token', null)
    const res = mockResponse()

    await checkAuth(req, res, () => {})

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      status: 401,
      message: 'NOT_AUTHORISED',
    })
  })

  test('should allow with a valid token', async () => {
    const mockRequest = (authHeader, sessionData) => ({
      headers: { authorization: authHeader },
      session: { data: sessionData },
    })

    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }

    const goodToken = generateAccessToken(1, 'email', '1D')

    const req = mockRequest(`Bearer ${goodToken}`, null)
    const res = mockResponse()
    const next = jest.fn()

    await checkAuth(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  test('should decode a valid token and append a user object to the request', async () => {
    const mockRequest = (authHeader, sessionData) => ({
      headers: { authorization: authHeader },
      session: { data: sessionData },
    })

    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }

    const goodToken = generateAccessToken(5, 'test@email.com', '1D')

    const req = mockRequest(`Bearer ${goodToken}`, null)
    const res = mockResponse()
    const next = jest.fn()

    await checkAuth(req, res, next)
    const { uid, email } = req.user

    expect(uid).toBe(5)
    expect(email).toBe('test@email.com')
  })
})
