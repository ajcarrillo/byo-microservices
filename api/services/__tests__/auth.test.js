import request from 'supertest'

import app from '../../../app.js'

describe('POST /sign-in', () => {
  beforeEach(() => {

  })

  afterEach(() => {

  })

  describe('When hitting the auth heartbeat endpoint', () => {
    test('request should retrun status 200', async () => {
      const response = await request(app).get('/api/auth')

      expect(response.statusCode).toBe(200)
    })
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

  describe('When submitting sign-up credentials', () => {
    test('request should fail without an email', async () => {
      const body = {
        email: '',
        password: 'password',
        profileName: 'profile',
      }
      const response = await request(app).post('/api/auth/sign-up').send(body)

      expect(response.statusCode).toBe(422)
      expect(response.body.message[0].param).toEqual('email')
      expect(response.body.message[0].msg).toEqual('Invalid value')
    })

    test('request should fail without correctly formatted email', async () => {
      const body = {
        email: 'bad@email',
        password: 'password',
        profileName: 'profile',
      }
      const response = await request(app).post('/api/auth/sign-up').send(body)

      expect(response.statusCode).toBe(422)
      expect(response.body.message[0].param).toEqual('email')
      expect(response.body.message[0].msg).toEqual('Invalid value')
    })

    test('request should fail without a password', async () => {
      const body = {
        email: 'good@email.com',
        password: '',
        profileName: 'profile',
      }
      const response = await request(app).post('/api/auth/sign-up').send(body)

      expect(response.statusCode).toBe(422)
      expect(response.body.message[0].param).toEqual('password')
      expect(response.body.message[0].msg).toEqual('Invalid value')
    })

    test('request should fail if password is too short', async () => {
      const body = {
        email: 'good@email.com',
        password: '1234567',
        profileName: 'profile',
      }
      const response = await request(app).post('/api/auth/sign-up').send(body)

      expect(response.statusCode).toBe(422)
      expect(response.body.message[0].param).toEqual('password')
      expect(response.body.message[0].msg).toEqual('Invalid value')
    })

    test('request should fail if password is too long', async () => {
      const body = {
        email: 'good@email.com',
        password: '111111111111111111111111111111111', // more than 32 characters
        profileName: 'profile',
      }
      const response = await request(app).post('/api/auth/sign-up').send(body)

      expect(response.statusCode).toBe(422)
      expect(response.body.message[0].param).toEqual('password')
      expect(response.body.message[0].msg).toEqual('Invalid value')
    })

    test('request should fail if profile name is missing', async () => {
      const body = {
        email: 'good@email.com',
        password: '12345678',
        profileName: '',
      }
      const response = await request(app).post('/api/auth/sign-up').send(body)

      expect(response.statusCode).toBe(422)
      expect(response.body.message[0].param).toEqual('profileName')
      expect(response.body.message[0].msg).toEqual('Invalid value')
    })
  })
})
