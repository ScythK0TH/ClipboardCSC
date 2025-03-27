const fs = require('fs');
// const Encryption = require('../util');

// util = new Encryption();

class User {
  constructor() {
    this.Users = [];
  }

  // Add a new User
  addUser(User) {
    this.Users.push(User);
  }

  // Get all Users
  getAllUsers() {
    //return this.Users;
    // return this.Users.map((User) => this.encryptUser(User));
    return this.Users;
  }

  searchByName(name) {
    const foundUsers = this.Users.filter((User) =>
      User.name.toLowerCase().includes(name.toLowerCase())
    );
    // .map((User) => this.encryptUser(User));
    return foundUsers;
  }

  // encryptUser(User) {
  //   return {
  //     ...User,
  //     username: util.encrypt(User.username),
  //   };
  // }

  // Save Users to a file
  saveUsersToFile(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.Users, null, 2));
  }

  // Load Users from a file
  loadUsersFromFile(filePath) {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      this.Users = JSON.parse(data);
    }
  }
}

module.exports = User;
