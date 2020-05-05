const { Schema, model, Types } = require('mongoose')

const authSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 6 },
  users: [{ type: Types.ObjectId, ref: 'Users' }]
})

module.exports = model('Auth', authSchema);