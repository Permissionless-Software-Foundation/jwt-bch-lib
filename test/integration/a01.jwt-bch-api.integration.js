/*
  Mocha unit tests for the jwt-bch-api.js library.
*/

const assert = require('chai').assert

const config = {
  login: 'test@test.com',
  password: 'test'
}

const JwtLib = require('../../src/jwt-bch-api')
const uut = new JwtLib(config)

describe('#jwt-bch-api.js', () => {
  describe('#register', () => {
    it('should log in', async () => {
      // Log into the Auth server.
      await uut.register()

      const userData = uut.userData
      // console.log(`userData: ${JSON.stringify(userData, null, 2)}`)

      // Verify the hasRegistered flag gets set.
      assert.property(userData, 'hasRegistered')
      assert.equal(userData.hasRegistered, true)

      // Ensure the user data has been populated.
      assert.property(userData, 'apiLevel')
      assert.property(userData, 'rateLimit')
      assert.property(userData, 'userId')
      assert.property(userData, 'userEmail')
      assert.property(userData, 'bchAddr')
      assert.property(userData, 'accessToken')
      assert.property(userData, 'apiToken')
    })
  })

  describe('#getApiToken', () => {
    it('should get a new API token', async () => {
      const result = await uut.getApiToken(0)

      assert.property(result, 'apiToken')
      assert.isString(result.apiToken)

      assert.property(result, 'apiLevel')
      assert.equal(result.apiLevel, 0)
    })
  })

  describe('#validateApiToken', () => {
    it('should validate API Token', async () => {
      const result = await uut.validateApiToken()

      assert.property(result, 'isValid')
      assert.equal(result.isValid, true)

      assert.property(result, 'apiLevel')
      assert.equal(result.apiLevel, 0)
    })
  })
})
