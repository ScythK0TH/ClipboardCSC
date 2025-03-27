const fs = require('fs');
const SortedLinkedList = require('./SortedLinkedList');

class User {
  constructor() {
    this.Users = new SortedLinkedList();
  }

  // Add a new User
  addUser(User) {
    this.Users.insert(User);
  }

  // Get all Users
  getAllUsers() {
    return this.Users.toArray();
  }

  searchByName(name) {
    const allUsers = this.Users.toArray();
    const foundUsers = allUsers.filter((User) =>
      User.name.toLowerCase().includes(name.toLowerCase())
    );
    return foundUsers;
  }

  // Save Users to a file
  saveUsersToFile(filePath) {
    const usersArray = this.Users.toArray();
    fs.writeFileSync(filePath, JSON.stringify(usersArray, null, 2));
  }

  // Load Users from a file
  loadUsersFromFile(filePath) {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      const usersArray = JSON.parse(data);
      this.Users = new SortedLinkedList();
      usersArray.forEach((user) => this.Users.insert(user));
    }
  }
}

module.exports = User;
