const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, default: function() { return this.username } },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create the User model
const UserModel = mongoose.model('User', userSchema);

class User {
  // Add a new User
  async addUser(user) {
    try {
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  // Get all Users
  async getAllUsers() {
    try {
      return await UserModel.find().sort({ username: 1 });
    } catch (error) {
      throw error;
    }
  }

  // Search users by name
  async searchByName(name) {
    try {
      return await UserModel.find({
        name: { $regex: name, $options: 'i' }
      }).sort({ username: 1 });
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  async findByUsername(username) {
    try {
      return await UserModel.findOne({ username });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
