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
  describe('#login', () => {
    it('should log in', async () => {
      const result = await uut.register()
      // const result = await uut.login()
      console.log(`result: ${result}`)

      const userData = uut.userData
      console.log(`userData: ${JSON.stringify(userData, null, 2)}`)

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
})
