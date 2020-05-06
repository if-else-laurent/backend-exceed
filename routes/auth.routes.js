const { Router } = require('express')
const router = Router()
const Auth = require('../models/Auth')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
// const config = require('config')
const dotenv = require('dotenv')

dotenv.config()

router.post('/register',
  [
    check('email', 'Uncorrect email').isEmail(),
    check('password', 'Minimum length of password 6 symbols')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Uncorrect data at registration'
        })
      }

      const { email, password } = req.body

      const candidate = await Auth.findOne({ email })

      if (candidate) {
        return res.status(400).json({ message: 'This user already exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new Auth({ email, password: hashedPassword })

      await user.save()

      res.status(201).json({ message: 'Users added!' })
    }
    catch (err) {
      res.status(400).json('Error: ' + err)
    }
  })

router.post('/login',
  [
    check('email', 'Please enter a valid email').normalizeEmail().isEmail(),
    check('password', 'Please enter a password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Uncorrect data at authorization'
        })
      }

      const { email, password } = req.body

      const user = await Auth.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Password, try again' })
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWTSECRET,
        { expiresIn: '1h' }
      )

      const authData = {
        token,
        userId: user._id,
        email
      }

      res.header('authToken', token).send(authData)

      // res.json({ token, userId: user._id });

    }
    catch (err) {
      res.status(400).json('Error: ' + err)
    }
  })


module.exports = router;

