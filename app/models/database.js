require('dotenv').config()
const mongoose = require('mongoose')

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}-pnzkk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

mongoose.connect( uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  }, (err) => {
    if (err) {
      console.log('Server failed to connect to MongoDB Atlas')
      console.log(err)
    } else
      console.log('Server connected to MongoDB Atlas')
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  emailAddress: {
    type: String,
    required: [true, 'Email address is required']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  }
})

module.exports = mongoose.model('User', userSchema)