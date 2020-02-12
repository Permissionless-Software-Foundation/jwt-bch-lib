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

describe('#jwt-bch-api.js', () => {
  let sandbox
  let uut

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    uut = new JwtLib(config)
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw error for undefined input', () => {
      try {
        const newUut = new JwtLib()

        // Prevent linting errors.
        console.log('newUut: ', newUut)

        // Code should not get to this point as a error is expected to be thrown.
        assert.equal(true, false, 'Unexpected result')
      } catch (err) {
        // console.log('err: ', err)
        // console.log(err.message)
        assert.include(err.message, 'Cannot read property')
      }
    })

    it('should throw error if login is not included', () => {
      try {
        const newUut = new JwtLib({})

        // Prevent linting errors.
        console.log('newUut: ', newUut)

        // Code should not get to this point as a error is expected to be thrown.
        assert.equal(true, false, 'Unexpected result')
      } catch (err) {
        assert.include(err.message, 'No login email provided.')
      }
    })

    it('should throw error if password is not included', () => {
      try {
        const newUut = new JwtLib({ login: 'test' })

        // Prevent linting errors.
        console.log('newUut: ', newUut)

        // Code should not get to this point as a error is expected to be thrown.
        assert.equal(true, false, 'Unexpected result')
      } catch (err) {
        assert.include(err.message, 'No password provided.')
      }
    })

    it('should instantiate with proper config input', () => {
      const newUut = new JwtLib(config)

      assert.property(newUut, 'login')
      assert.property(newUut, 'password')
    })
  })

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

    it('should handle errors thrown by axios', async () => {
      try {
        sandbox.stub(uut.axios, 'request').throws({ code: 'ECONNABORTED' })
        await uut.register()
      } catch (err) {
        assert.property(err, 'code')
      }
    })
  })
})
