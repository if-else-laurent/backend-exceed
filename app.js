const express = require('express')
// const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors');
// const dotenv = require('dotenv');
const path = require('path');

// dotenv.config()

const app = express()

// Middleware
app.use(express.json({ extended: true }))
app.use(cors());

app.use('/', require('./routes/user.routes'))
app.use('/auth', require('./routes/auth.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  })
}

// const PORT = config.get('port') || 5000
const PORT = process.env.PORT || 5000

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Vladislav:123456zzv@cluster0-zkzbh.gcp.mongodb.net/test?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })

    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  }
  catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()



