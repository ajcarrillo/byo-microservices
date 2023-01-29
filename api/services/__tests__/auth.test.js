import request from 'supertest'

import app from '../../../app.js'

describe('POST /sign-in', () => {
  beforeEach(() => {

  })

  afterEach(() => {

  })

  describe('When submitting sign-in credentials', () => {
    test('request should fail without correctly formatted email', async () => {
      const body = {
        email: 'bad@email',
        password: 'password',
      }
      const response = await request(app).post('/api/auth/sign-in').send(body)

      expect(response.statusCode).toBe(422)
      expect(response.body.message[0].param).toEqual('email')
      expect(response.body.message[0].msg).toEqual('Invalid value')
    })

    test('request should fail without a password', async () => {
      const body = {
        email: 'good@email.com',
        password: '',
      }
      const response = await request(app).post('/api/auth/sign-in').send(body)

      expect(response.statusCode).toBe(422)
      expect(response.body.message[0].param).toEqual('password')
      expect(response.body.message[0].msg).toEqual('Invalid value')
    })
  })
})
