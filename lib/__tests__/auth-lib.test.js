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
        createNewUser: jest.fn(() => {}),
        createNewUserProfile: jest.fn(() => {}),
        createNewUserSettings: jest.fn(() => {}),
        getUserIdByEmail: jest.fn(() => {}),
        getUserByEmail: jest.fn(() => Promise.reject(new Error('ERROR'))),
        updateUserPassword: jest.fn(() => {}),
        setPasswordResetCode: jest.fn(() => {}),
        clearEmailConfirmCode: jest.fn(() => {}),
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
        token: 'new-token',
        userName: {
          firstName: 'test',
          lastName: 'user',
        },
      }

      jest.unstable_mockModule('../sql/user-sql', () => ({
        createNewUser: jest.fn(() => {}),
        createNewUserProfile: jest.fn(() => {}),
        createNewUserSettings: jest.fn(() => {}),
        getUserIdByEmail: jest.fn(() => {}),
        getUserByEmail: jest.fn(() => Promise.resolve([dbResult])),
        updateUserPassword: jest.fn(() => {}),
        setPasswordResetCode: jest.fn(() => {}),
        clearEmailConfirmCode: jest.fn(() => {}),
      }))
      const { authoriseSignIn } = await import('../auth-lib')

      const result = await authoriseSignIn('email', 'testpassword')
      result.token = 'new-token'

      expect(result).toStrictEqual(authoriseResult)
    })
  })

  describe('When signing up a new user', () => {
    test('simulate a database error when finding user ID by email', async () => {
      jest.unstable_mockModule('../sql/user-sql', () => ({
        createNewUser: jest.fn(() => {}),
        createNewUserProfile: jest.fn(() => {}),
        createNewUserSettings: jest.fn(() => {}),
        getUserIdByEmail: jest.fn(() => Promise.reject(new Error('ERROR'))),
        getUserByEmail: jest.fn(() => {}),
        updateUserPassword: jest.fn(() => {}),
        setPasswordResetCode: jest.fn(() => {}),
        clearEmailConfirmCode: jest.fn(() => {}),
      }))
      const { signUpNewUser } = await import('../auth-lib')

      return expect(signUpNewUser('email', 'password', 'profileName')).rejects.toThrow('ERROR')
    })

    test('disallow signup if email is already registered', async () => {
      jest.unstable_mockModule('../sql/user-sql', () => ({
        createNewUser: jest.fn(() => {}),
        createNewUserProfile: jest.fn(() => {}),
        createNewUserSettings: jest.fn(() => {}),
        getUserIdByEmail: jest.fn(() => Promise.resolve([{}])),
        getUserByEmail: jest.fn(() => {}),
        updateUserPassword: jest.fn(() => {}),
        setPasswordResetCode: jest.fn(() => {}),
        clearEmailConfirmCode: jest.fn(() => {}),
      }))
      const { signUpNewUser } = await import('../auth-lib')

      return expect(signUpNewUser('email', 'password', 'profileName'))
        .rejects.toThrow('SIGNUP_EMAIL_ALREADY_REGISTERED')
    })

    test('disallow signup when a database insert fails in the users table', async () => {
      jest.unstable_mockModule('../sql/user-sql', () => ({
        createNewUser: jest.fn(() => Promise.reject(new Error('DB_ERROR'))),
        createNewUserProfile: jest.fn(() => {}),
        createNewUserSettings: jest.fn(() => {}),
        getUserIdByEmail: jest.fn(() => Promise.resolve([])),
        getUserByEmail: jest.fn(() => {}),
        updateUserPassword: jest.fn(() => {}),
        setPasswordResetCode: jest.fn(() => {}),
        clearEmailConfirmCode: jest.fn(() => {}),
      }))
      const { signUpNewUser } = await import('../auth-lib')

      return expect(signUpNewUser('email', 'password', 'profileName'))
        .rejects.toThrow('DB_ERROR')
    })

    test('disallow signup when a database insert fails in the users_settings table', async () => {
      jest.unstable_mockModule('../sql/user-sql', () => ({
        createNewUser: jest.fn(() => Promise.resolve(1)),
        createNewUserProfile: jest.fn(() => {}),
        createNewUserSettings: jest.fn(() => Promise.reject(new Error('DB_ERROR'))),
        getUserIdByEmail: jest.fn(() => Promise.resolve([])),
        getUserByEmail: jest.fn(() => {}),
        updateUserPassword: jest.fn(() => {}),
        setPasswordResetCode: jest.fn(() => {}),
        clearEmailConfirmCode: jest.fn(() => {}),
      }))
      const { signUpNewUser } = await import('../auth-lib')

      return expect(signUpNewUser('email', 'password', 'profileName'))
        .rejects.toThrow('DB_ERROR')
    })

    test('disallow signup when a database insert fails in the users_profiles table', async () => {
      jest.unstable_mockModule('../sql/user-sql', () => ({
        createNewUser: jest.fn(() => Promise.resolve(1)),
        createNewUserProfile: jest.fn(() => Promise.reject(new Error('DB_ERROR'))),
        createNewUserSettings: jest.fn(() => Promise.resolve()),
        getUserIdByEmail: jest.fn(() => Promise.resolve([])),
        getUserByEmail: jest.fn(() => {}),
        updateUserPassword: jest.fn(() => {}),
        setPasswordResetCode: jest.fn(() => {}),
        clearEmailConfirmCode: jest.fn(() => {}),
      }))
      const { signUpNewUser } = await import('../auth-lib')

      return expect(signUpNewUser('email', 'password', 'profileName'))
        .rejects.toThrow('DB_ERROR')
    })

    test('ensure no errors are thrown during a successful signup', async () => {
      jest.unstable_mockModule('../email-lib', () => ({
        createMailerTransport: jest.fn(() => {}),
        generateEmailContent: jest.fn(() => ({htmlEmail: {body: '', subject: ''}, textEmail: {body: '', subject: ''}})),
        sendEmail: jest.fn(() => {}),
      }))
      jest.unstable_mockModule('../sql/user-sql', () => ({
        createNewUser: jest.fn(() => Promise.resolve(1)),
        createNewUserProfile: jest.fn(() => Promise.resolve()),
        createNewUserSettings: jest.fn(() => Promise.resolve()),
        getUserIdByEmail: jest.fn(() => Promise.resolve([])),
        getUserByEmail: jest.fn(() => {}),
        updateUserPassword: jest.fn(() => {}),
        setPasswordResetCode: jest.fn(() => {}),
        clearEmailConfirmCode: jest.fn(() => {}),
      }))
      const { signUpNewUser } = await import('../auth-lib')

      return expect(signUpNewUser('email', 'password', 'profileName')).resolves.toBe('COMPLETE')
    })
  })
})
