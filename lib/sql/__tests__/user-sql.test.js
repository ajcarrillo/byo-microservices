import { jest } from '@jest/globals'

describe('user-sql', () => {
  beforeEach(() => {

  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
    jest.resetModules()
  })

  describe('getUserIdByEmail()', () => {
    test('should reject with an error if database select statement has errors', async () => {
      jest.unstable_mockModule('../../database-lib', () => ({
        dbSelect: jest.fn(() => Promise.resolve({error: 'DB_ERROR'})),
        dbInsert: jest.fn(() => {}),
        dbUpdate: jest.fn(() => {}),
        dbDelete: jest.fn(() => {}),
      }))
      const { getUserIdByEmail } = await import('../user-sql')

      return expect(getUserIdByEmail('email')).rejects.toThrow('DB_ERROR')
    })

    test('should resolve with results if database select statement has no errors', async () => {
      jest.unstable_mockModule('../../database-lib', () => ({
        dbSelect: jest.fn(() => Promise.resolve({error: null, results: []})),
        dbInsert: jest.fn(() => {}),
        dbUpdate: jest.fn(() => {}),
        dbDelete: jest.fn(() => {}),
      }))
      const { getUserIdByEmail } = await import('../user-sql')

      return expect(getUserIdByEmail('email')).resolves.toStrictEqual([])
    })
  })

  describe('getUserByEmail()', () => {
    test('should reject with an error if database select statement has errors', async () => {
      jest.unstable_mockModule('../../database-lib', () => ({
        dbSelect: jest.fn(() => Promise.resolve({error: 'DB_ERROR'})),
        dbInsert: jest.fn(() => {}),
        dbUpdate: jest.fn(() => {}),
        dbDelete: jest.fn(() => {}),
      }))
      const { getUserByEmail } = await import('../user-sql')

      return expect(getUserByEmail('email')).rejects.toThrow('DB_ERROR')
    })

    test('should resolve with results if database select statement has no errors', async () => {
      jest.unstable_mockModule('../../database-lib', () => ({
        dbSelect: jest.fn(() => Promise.resolve({error: null, results: []})),
        dbInsert: jest.fn(() => {}),
        dbUpdate: jest.fn(() => {}),
        dbDelete: jest.fn(() => {}),
      }))
      const { getUserByEmail } = await import('../user-sql')

      return expect(getUserByEmail('email')).resolves.toStrictEqual([])
    })
  })

  describe('createNewUser()', () => {
    test('should reject with an error if database insert statement has errors', async () => {
      jest.unstable_mockModule('../../database-lib', () => ({
        dbSelect: jest.fn(() => {}),
        dbInsert: jest.fn(() => Promise.resolve({error: 'DB_ERROR'})),
        dbUpdate: jest.fn(() => {}),
        dbDelete: jest.fn(() => {}),
      }))
      const { createNewUser } = await import('../user-sql')

      return expect(createNewUser('address', 'email', 'password')).rejects.toThrow('DB_ERROR')
    })

    test('should resolve with an insert ID if database insert statement has no errors', async () => {
      jest.unstable_mockModule('../../database-lib', () => ({
        dbSelect: jest.fn(() => {}),
        dbInsert: jest.fn(() => Promise.resolve({error: null, insertID: 1})),
        dbUpdate: jest.fn(() => {}),
        dbDelete: jest.fn(() => {}),
      }))
      const { createNewUser } = await import('../user-sql')

      return expect(createNewUser('address', 'email', 'password')).resolves.toBe(1)
    })
  })

  describe('createNewUserSettings()', () => {
    test('should reject with an error if database insert statement has errors', async () => {
      jest.unstable_mockModule('../../database-lib', () => ({
        dbSelect: jest.fn(() => {}),
        dbInsert: jest.fn(() => Promise.resolve({error: 'DB_ERROR'})),
        dbUpdate: jest.fn(() => {}),
        dbDelete: jest.fn(() => {}),
      }))
      const { createNewUserSettings } = await import('../user-sql')

      return expect(createNewUserSettings(1, 'emailCode')).rejects.toThrow('DB_ERROR')
    })

    test('should resolve with an insert ID if database insert statement has no errors', async () => {
      jest.unstable_mockModule('../../database-lib', () => ({
        dbSelect: jest.fn(() => {}),
        dbInsert: jest.fn(() => Promise.resolve({error: null, insertID: 2})),
        dbUpdate: jest.fn(() => {}),
        dbDelete: jest.fn(() => {}),
      }))
      const { createNewUserSettings } = await import('../user-sql')

      return expect(createNewUserSettings(1, 'emailCode')).resolves.toBe(2)
    })
  })

  describe('createNewUserProfile()', () => {
    test('should reject with an error if database insert statement has errors', async () => {
      jest.unstable_mockModule('../../database-lib', () => ({
        dbSelect: jest.fn(() => {}),
        dbInsert: jest.fn(() => Promise.resolve({error: 'DB_ERROR'})),
        dbUpdate: jest.fn(() => {}),
        dbDelete: jest.fn(() => {}),
      }))
      const { createNewUserProfile } = await import('../user-sql')

      return expect(createNewUserProfile(1, 'profile')).rejects.toThrow('DB_ERROR')
    })

    test('should resolve with an insert ID if database insert statement has no errors', async () => {
      jest.unstable_mockModule('../../database-lib', () => ({
        dbSelect: jest.fn(() => {}),
        dbInsert: jest.fn(() => Promise.resolve({error: null, insertID: 3})),
        dbUpdate: jest.fn(() => {}),
        dbDelete: jest.fn(() => {}),
      }))
      const { createNewUserProfile } = await import('../user-sql')

      return expect(createNewUserProfile(1, 'profile')).resolves.toBe(3)
    })
  })
})
