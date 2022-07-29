const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if(token == null){
    next({ status: 401, message: 'token required' });
    return;
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if(err){
      next({ status: 401, message: 'token invalid' })
      return
    } else {
      console.log(decoded)
      req.jwt = decoded;
      next()
    }
  })
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
