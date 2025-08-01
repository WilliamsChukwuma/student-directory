// // models/User.js – This defines my user schema and hashes passwords securely

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// This method hashes the password and sets it to the user object
userSchema.methods.setPassword = async function (plainPassword) {
  const hash = await bcrypt.hash(plainPassword, 10);
  this.password = hash;
};

// This method checks if a given password matches the stored hash
userSchema.methods.validatePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

