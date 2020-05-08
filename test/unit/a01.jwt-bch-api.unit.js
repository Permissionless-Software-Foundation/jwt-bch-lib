/*
  Mocha unit tests for the jwt-bch-api.js library.
*/

const assert = require('chai').assert
const sinon = require('sinon')

const mockData = require('./mocks/jwt-bch-api.mocks')

const JwtLib = require('../../src/jwt-bch-lib')

describe('#jwt-bch-lib.js', () => {
  let sandbox
  let uut

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    uut = new JwtLib()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should instantiate with default values.', () => {
      const newUut = new JwtLib()
      // console.log('newUut: ', newUut)

      assert.property(newUut, 'server')
      assert.equal(newUut.server, 'https://auth.fullstack.cash')

      assert.property(newUut, 'login')
      assert.equal(newUut.login, 'demo@demo.com')

      assert.property(newUut, 'password')
      assert.equal(newUut.password, 'demo')
    })

    it('should overwrite values when included with config', () => {
      const config = {
        login: 'testlogin',
        password: 'testpass',
        server: 'myserver'
      }

      const newUut = new JwtLib(config)
      // console.log('newUut: ', newUut)

      assert.property(newUut, 'server')
      assert.equal(newUut.server, 'myserver')

      assert.property(newUut, 'login')
      assert.equal(newUut.login, 'testlogin')

      assert.property(newUut, 'password')
      assert.equal(newUut.password, 'testpass')
    })
  })

  describe('#register', () => {
    it('should log in and retrieve user data', async () => {
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

    it('should handle errors thrown by axios', async () => {
      try {
        sandbox.stub(uut.axios, 'request').throws({ code: 'ECONNABORTED' })
        await uut.register()
      } catch (err) {
        assert.property(err, 'code')
      }
    })
  })

  describe('#getApiToken', () => {
    it('should throw error for non-integer apiLevel', async () => {
      try {
        await uut.getApiToken('abc')

        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, 'apiLevel must be a positive integer')
      }
    })

    it('should get a new free-tier API token', async () => {
      // Mock network calls.
      sandbox.stub(uut.axios, 'request').resolves({ data: mockData.freeTier })

      const result = await uut.getApiToken(0)

      assert.property(result, 'apiToken')
      assert.isString(result.apiToken)

      assert.property(result, 'apiLevel')
      assert.equal(result.apiLevel, 0)
    })

    it('should handle errors thrown by axios', async () => {
      try {
        sandbox.stub(uut.axios, 'request').throws({ code: 'ECONNABORTED' })
        await uut.getApiToken(0)
      } catch (err) {
        assert.property(err, 'code')
      }
    })
  })

  describe('#validateApiToken', () => {
    it('should validate API Token', async () => {
      // Mock network calls.
      sandbox.stub(uut.axios, 'request').resolves({ data: mockData.validate })

      const result = await uut.validateApiToken()

      assert.property(result, 'isValid')
      assert.equal(result.isValid, true)

      assert.property(result, 'apiLevel')
      assert.equal(result.apiLevel, 0)
    })

    it('should handle errors thrown by axios', async () => {
      try {
        sandbox.stub(uut.axios, 'request').throws({ code: 'ECONNABORTED' })
        await uut.validateApiToken()
      } catch (err) {
        assert.property(err, 'code')
      }
    })
  })

  describe('#getBchAddr', () => {
    it('should get user addr', () => {
      const result = uut.getBchAddr()
      console.log(`BCH Address: ${result}`)
    })
  })

  describe('#updateCredit', () => {
    it('should return the user credit', async () => {
      // Mock network calls.
      sandbox.stub(uut.axios, 'request').resolves({ data: 0 })

      const result = await uut.updateCredit()
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result, 0)
    })

    it('should handle errors thrown by axios', async () => {
      try {
        sandbox.stub(uut.axios, 'request').throws({ code: 'ECONNABORTED' })
        await uut.updateCredit()
      } catch (err) {
        assert.property(err, 'code')
      }
    })
  })
})
