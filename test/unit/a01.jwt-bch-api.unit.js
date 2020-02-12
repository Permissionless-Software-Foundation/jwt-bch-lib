/*
  Mocha unit tests for the jwt-bch-api.js library.
*/

const assert = require('chai').assert
const sinon = require('sinon')

const mockData = require('./mocks/jwt-bch-api.mocks')

const config = {
  login: 'test@test.com',
  password: 'test'
}

const JwtLib = require('../../src/jwt-bch-api')
const uut = new JwtLib(config)

describe('#jwt-bch-api.js', () => {
  let sandbox
  beforeEach(() => (sandbox = sinon.createSandbox()))
  afterEach(() => sandbox.restore())

  describe('#login', () => {
    it('should log in', async () => {
      // Mock network calls.
      sandbox.stub(uut.axios, 'request').resolves({ data: mockData.userData })

      const result = await uut.register()
      // console.log(`result: ${result}`)

      // Expecting true to be returned.
      assert.equal(result, true)

      const userData = uut.userData

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
