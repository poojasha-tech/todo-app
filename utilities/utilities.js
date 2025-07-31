const crypto = require('crypto');
const jwt = require('jsonwebtoken');   
const secret="bigsecret"; // Define your secret key for JWT signing



function hashPassword(password) {
  const hash = crypto.createHmac('md5', secret).update(password).digest('hex');
  return hash
}

function jwtToken(user) {
  var token = jwt.sign({

    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
    data: user
  }, secret);
  return token;
}

module.exports = { hashPassword, jwtToken };
// Exporting the functions so they can be used in other files
// This allows us to use these utility functions in other parts of the application
// such as in the auth and todo controllers for hashing passwords and generating JWT tokens.
// The functions are exported as an object, so they can be imported and used in other files
// using destructuring syntax.
// For example, in auth.js, we can import them like this:
// const { hashPassword, jwtToken } = require("../utilities/utilities");    