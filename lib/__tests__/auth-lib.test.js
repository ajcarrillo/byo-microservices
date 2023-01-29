import { jest } from '@jest/globals'

describe('auth-lib', () => {
  beforeEach(() => {

  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
    jest.resetModules()
  })

  describe('When authorising sign-in credentials', () => {
    test('simulate a database error when finding user by email', async () => {
      jest.unstable_mockModule('../sql/user-sql', () => ({
        getUserByEmail: jest.fn(() => Promise.reject(new Error('ERROR'))),
      }))
      const { authoriseSignIn } = await import('../auth-lib')

      return expect(authoriseSignIn('email', 'password')).rejects.toThrow('ERROR')
    })

    test('we should receive a user object when credentials are authorised', async () => {
      const dbResult = {
        uid: 1,
        email_address: 'me@you.com',
        email_confirmed: 1,
        account_restricted: 0,
        first_name: 'test',
        last_name: 'user',
        password: '$2b$10$UvoGoOmoz5ne8FvkDQza2.XU2/6VxYiSEXZ5Ja5.V6.IG5FLt3GEu',
      }
      const authoriseResult = {
        uid: 1,
        // eslint-disable-next-line max-len
        token: 'new-token',
        userName: {
          firstName: 'test',
          lastName: 'user',
        },
      }

      jest.unstable_mockModule('../sql/user-sql', () => ({
        getUserByEmail: jest.fn(() => Promise.resolve([dbResult])),
      }))
      const { authoriseSignIn } = await import('../auth-lib')

      const result = await authoriseSignIn('email', 'testpassword')
      result.token = 'new-token'

      expect(result).toStrictEqual(authoriseResult)
    })
  })
})
