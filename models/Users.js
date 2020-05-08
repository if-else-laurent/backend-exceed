const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  name: { type: String, required: true }, //Required - обязательное поле
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  address: { type: Object },
  company: { type: Object },
  owner: { type: Types.ObjectId, ref: 'Auth' }
})

module.exports = model('Users', schema)