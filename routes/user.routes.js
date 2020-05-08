const { Router } = require('express')
const router = Router()
const Users = require('../models/Users')
const auth = require('./jwt.routes')

// homePage получение данных
router.get('/', auth,
  async (req, res) => {
    try {
      const users = await Users.find({ owner: req.user.userId })
      res.json(users)
    }
    catch (err) {
      res.status(400).json('Error: ' + err)
    }
  })

router.post('/add', auth,
  async (req, res) => {
    try {
      const { name, username, email, owner } = req.body
      const newUser = new Users({ //Сделать деструктуризацию
        name,
        username,
        email,
        owner
      });

      await newUser.save()
      const users = await Users.find({ owner: req.user.userId })

      res.json(users)
      // res.json('User added!')
    }
    catch (err) {
      res.status(400).json('Error: ' + err)
    }
  })

router.post('/:id/edit', auth,
  async (req, res) => {
    try {
      const editedUser = req.body
      console.log(editedUser)
      const {
        name,
        username,
        email,
        address,
        phone,
        website,
        company,
      } = editedUser

      await Users.findByIdAndUpdate(editedUser._id, {
        name,
        username,
        email,
        address,
        phone,
        website,
        company,
      })


      // await newUser.save()
      const users = await Users.find({ owner: req.user.userId })

      res.json(users)
      // res.json('User added!')
    }
    catch (err) {
      res.status(400).json('Error: ' + err)
    }
  })

router.delete('/:id', auth,
  async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id)
      const users = await Users.find({ owner: req.user.userId })

      res.json(users)
      // res.json('User deleted.')
    }
    catch (err) {
      res.status(400).json('Error: ' + err)
    }
  })


module.exports = router
