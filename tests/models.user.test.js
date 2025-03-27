const User = require('../models/userModel');
const fs = require('fs');

jest.mock('fs');

describe('User Model Tests', () => {
  let userManager;

  beforeEach(() => {
    userManager = new User();
  });

  test('1. Should add a new user', () => {
    const newUser = { name: 'John Doe', username: 'johndoe' };
    userManager.addUser(newUser);
    expect(userManager.getAllUsers()).toHaveLength(1);
    expect(userManager.getAllUsers()[0]).toEqual(newUser);
  });

  test('2. Should get all users', () => {
    userManager.addUser({ name: 'Alice', username: 'alice' });
    userManager.addUser({ name: 'Bob', username: 'bob' });
    expect(userManager.getAllUsers()).toHaveLength(2);
  });

  test('3. Should search users by name', () => {
    userManager.addUser({ name: 'Alice', username: 'alice' });
    userManager.addUser({ name: 'Bob', username: 'bob' });
    const result = userManager.searchByName('alice');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });

  test('4. Should return an empty array if no users match the search', () => {
    userManager.addUser({ name: 'Alice', username: 'alice' });
    const result = userManager.searchByName('nonexistent');
    expect(result).toHaveLength(0);
  });

  test('5. Should save users to a file', () => {
    userManager.addUser({ name: 'Alice', username: 'alice' });
    userManager.saveUsersToFile('test.json');
    expect(fs.writeFileSync).toHaveBeenCalledWith('test.json', expect.any(String));
  });

  test('6. Should load users from a file', () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify([{ name: 'Alice', username: 'alice' }]));
    userManager.loadUsersFromFile('test.json');
    expect(userManager.getAllUsers()).toHaveLength(1);
    expect(userManager.getAllUsers()[0].name).toBe('Alice');
  });

  test('7. Should handle loading from a non-existent file gracefully', () => {
    fs.existsSync.mockReturnValue(false);
    userManager.loadUsersFromFile('nonexistent.json');
    expect(userManager.getAllUsers()).toHaveLength(0);
  });
});