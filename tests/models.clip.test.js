const Clip = require('../models/clipModel');
const fs = require('fs');

jest.mock('fs');

describe('Clip Model Tests', () => {
  let clipManager;

  beforeEach(() => {
    clipManager = new Clip();
  });

  test('1. Should add a new clip', () => {
    const newClip = { title: 'Test Clip', username: 'user1', content: 'Sample content' };
    clipManager.addClip(newClip);
    expect(clipManager.getAllClips()).toHaveLength(1);
    expect(clipManager.getAllClips()[0]).toEqual(newClip);
  });

  test('2. Should get all clips', () => {
    clipManager.addClip({ title: 'Clip 1', username: 'user1', content: 'Content 1' });
    clipManager.addClip({ title: 'Clip 2', username: 'user2', content: 'Content 2' });
    expect(clipManager.getAllClips()).toHaveLength(2);
  });

  test('3. Should get user-specific clips', () => {
    clipManager.addClip({ title: 'Clip 1', username: 'user1' });
    clipManager.addClip({ title: 'Clip 2', username: 'user2' });
    expect(clipManager.getUserClips('user1')).toHaveLength(1);
  });

  test('4. Should search clips by name', () => {
    clipManager.addClip({ title: 'Important Clip', username: 'user1' });
    clipManager.addClip({ title: 'Random Clip', username: 'user1' });
    const result = clipManager.searchClipboardByName('important', 'user1');
    expect(result).toHaveLength(1);
  });

  test('5. Should return empty array when searching with no user', () => {
    clipManager.addClip({ title: 'Important Clip', username: 'user1' });
    const result = clipManager.searchClipboardByName('important', null);
    expect(result).toEqual([]);
  });

  test('6. Should delete the last clip', () => {
    clipManager.addClip({ title: 'Old Clip', username: 'user1' });
    clipManager.addClip({ title: 'New Clip', username: 'user1' });
    clipManager.deleteLastClip('user1');
    expect(clipManager.getUserClips('user1')[0].title).toBe('New Clip'); // Old Clip remains
  });  

  test('7. Should delete the first clip', () => {
    clipManager.addClip({ title: 'Old Clip', username: 'user1' });
    clipManager.addClip({ title: 'New Clip', username: 'user1' });
    clipManager.deleteFirstClip('user1');
    expect(clipManager.getUserClips('user1')[0].title).toBe('Old Clip'); // New Clip remains
  });

  test('8. Should delete a specific clip by title and username', () => {
    clipManager.addClip({ title: 'Clip 1', username: 'user1' });
    clipManager.addClip({ title: 'Clip 2', username: 'user2' });
    clipManager.deleteClip('Clip 1', 'user1');
    expect(clipManager.getAllClips()).toHaveLength(1);
    expect(clipManager.getAllClips()[0].title).toBe('Clip 2'); // Clip 2 remains
  });

  test('9. Should save clips to a file', () => {
    clipManager.addClip({ title: 'Saved Clip', username: 'user1' });
    clipManager.saveClipsToFile('test.json');
    expect(fs.writeFileSync).toHaveBeenCalledWith('test.json', expect.any(String));
  });

  test('10. Should load clips from a file', () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify([{ title: 'Loaded Clip', username: 'user1' }]));
    clipManager.loadClipsFromFile('test.json');
    expect(clipManager.getAllClips()).toHaveLength(1);
    expect(clipManager.getAllClips()[0].title).toBe('Loaded Clip');
  });

  test('11. Should handle loading from a non-existent file gracefully', () => {
    fs.existsSync.mockReturnValue(false);
    clipManager.loadClipsFromFile('nonexistent.json');
    expect(clipManager.getAllClips()).toHaveLength(0);
  });

  test('12. Should sort all clips by title (A-Z)', () => {
    clipManager.addClip({ title: 'Zebra', username: 'user1' });
    clipManager.addClip({ title: 'Apple', username: 'user2' });
    const sortedClips = clipManager.getAllClips();
    expect(sortedClips[0].title).toBe('Apple'); // Alphabetically first
    expect(sortedClips[1].title).toBe('Zebra'); // Alphabetically last
  });

  test('13. Should handle deleting the last clip when no clips exist', () => {
    clipManager.deleteLastClip('user1');
    expect(clipManager.getAllClips()).toHaveLength(0);
  });

  test('14. Should handle deleting the first clip when no clips exist', () => {
    clipManager.deleteFirstClip('user1');
    expect(clipManager.getAllClips()).toHaveLength(0);
  });

  test('15. Should handle deleting a specific clip when it does not exist', () => {
    clipManager.addClip({ title: 'Clip 1', username: 'user1' });
    clipManager.deleteClip('Nonexistent Clip', 'user1');
    expect(clipManager.getAllClips()).toHaveLength(1);
  });

  test('16. Should return all clips for a user when searching with no title provided', () => {
    clipManager.addClip({ title: 'Important Clip', username: 'user1' });
    clipManager.addClip({ title: 'Another Clip', username: 'user1' });
    const result = clipManager.searchClipboardByName('', 'user1');
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Another Clip'); // Sorted alphabetically
    expect(result[1].title).toBe('Important Clip');
  });
});