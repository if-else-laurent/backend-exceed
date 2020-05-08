const jwt = require('jsonwebtoken');
// const config = require('config')
// const dotenv = require('dotenv')

// dotenv.config()

function auth(req, res, next) {
  try {
    const token = req.header('authToken');
    if (!token) return res.status(401).send('Access Denied');
    const verified = jwt.verify(token, process.env.JWTSECRET || 'randomword');
    // const verified = jwt.verify(token, config.get('jwtSecret'));
    req.user = verified;
    next();
  }
  catch (err) {
    res.status(400).send('Invalid Token')
  }

}

module.exports = auth;