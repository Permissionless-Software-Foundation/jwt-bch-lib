# jwt-bch-lib
An [npm library](https://www.npmjs.com/package/jwt-bch-lib) for interacting with jwt-bch-api used by fullstack.cash

## Quick Links

- [npm library](https://www.npmjs.com/package/jwt-bch-lib)
- [jwt-bch-demo](https://github.com/Permissionless-Software-Foundation/jwt-bch-demo)

## Install

- Install the library: `npm install jwt-bch-lib`

## Usage

- Instantiate the library in your code:

```
const JwtLib = require('jwt-bch-lib')
const jwtLib = new JwtLib({
  // Overwrite default values with the psf credentials.
  server: 'https://auth.fullstack.cash',
  login: process.env.FULLSTACKLOGIN, // 'demo@demo.com'
  password: process.env.FULLSTACKPASS // 'demo'
})

```
- Get and Renew FullStack.cash JWT
```
// Get's a JWT token from FullStack.cash.
async function getJWT(){
  try {
    // This variable will hold the JWT token.
    let apiToken
    // Log into the auth server.
    await jwtLib.register()

    apiToken = jwtLib.userData.apiToken
    if(!apiToken){
      throw new Error(`This account does not have a JWT`)
    }

    // Ensure the JWT token is valid to use.
    const isValid = await jwtLib.validateApiToken()

    // Get a new token with the same API level,
    // if the existing token is not
    // valid (probably expired).
    if (!isValid.isValid) {
      apiToken = await jwtLib.getApiToken(jwtLib.userData.apiLevel)
      console.log(`The JWT token was not valid. Retrieved new JWT token: ${apiToken}\n`)
    } else {
      console.log('JWT token is valid.\n')
    }
    return apiToken
  } catch (err) {
    console.error(`Error trying to log and retrieve JWT token.`)
    throw err
  }
}
```

## Support

Have questions? Need help? Join our community support
[Telegram channel](https://t.me/bch_js_toolkit)

## License
[MIT](./LICENSE.md)