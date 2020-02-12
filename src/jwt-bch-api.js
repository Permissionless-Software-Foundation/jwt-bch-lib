/*
  This library contains methods for interacting with the jwt-bch-api, targeting
  the implementation at fullstack.cash.
*/

'use strict'

const axios = require('axios')
const config = require('../config')

let _this

class JwtBchApi {
  constructor (config) {
    _this = this
    this.userData = {
      hasRegistered: false
    }

    if (!config.login) {
      throw new Error(
        'No login email provided. You must initialize jwt-bch-api with login for fullstack.cash.'
      )
    }
    _this.login = config.login

    if (!config.login) {
      throw new Error(
        'No password provided. You must initialize jwt-bch-api with login for fullstack.cash.'
      )
    }
    _this.password = config.password

    this.axios = axios

    // Axios Option template.
    this.axiosOptions = {
      timeout: 15000,
      responseType: 'json'
    }
  }

  // register with the JWT server by logging in, populate the userData.
  async register () {
    try {
      const options = this.axiosOptions
      options.method = 'post'
      options.url = `${config.SERVER}/auth`
      options.data = {
        email: _this.login,
        password: _this.password
      }

      const result = await _this.axios.request(options)
      // console.log(`result.data: ${JSON.stringify(result.data, null, 2)}`)

      // Populate local data from the server response.
      _this.userData.apiLevel = result.data.user.apiLevel
      _this.userData.rateLimit = result.data.user.rateLimit
      _this.userData.userId = result.data.user._id
      _this.userData.userEmail = result.data.user.email
      _this.userData.bchAddr = result.data.user.bchAddr

      // Access token is the JWT token used to work with auth.fullstack.cash.
      _this.userData.accessToken = result.data.token

      // API token is the JWT token used to work with api.fullstack.cash.
      _this.userData.apiToken = result.data.user.apiToken

      // Set the flag to indicate that the user has registered.
      _this.userData.hasRegistered = true

      return true
    } catch (err) {
      console.error('Error in jwt-bch-api.js/login()')
      throw err
    }
  }
}

module.exports = JwtBchApi
