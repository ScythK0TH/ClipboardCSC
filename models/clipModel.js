const fs = require('fs');
const SortedLinkedList = require('./SortedLinkedList');

class Clip {
  constructor() {
    this.Clips = new SortedLinkedList();
  }

  // Add a new Clip (automatically sorted by title)
  addClip(clip) {
    this.Clips.insert(clip);
  }

  // Get all Clips
  getAllClips() {
    return this.Clips.toArray();
  }

  // Get Clips for a specific user
  getUserClips(username) {
    return this.Clips.toArray().filter((clip) => clip.username === username);
  }

  // Search Clips by name and user
  searchClipboardByName(name, user) {
    if (!user) return [];
    if (!name) return this.getUserClips(user);

    return this.Clips.toArray().filter(
      (clip) =>
        clip.title.toLowerCase().includes(name.toLowerCase()) &&
        clip.username === user
    );
  }

  // Delete the newest Clip (last in the list)
  deleteNewestClip(user) {
    const userClips = this.getUserClips(user);
    if (userClips.length > 0) {
      const newestClip = userClips[userClips.length - 1];
      this.Clips.removeByCondition(
        (clip) => clip.title === newestClip.title && clip.username === user
      );
    }
  }

  // Delete the oldest Clip (first in the list)
  deleteOldestClip(user) {
    const userClips = this.getUserClips(user);
    if (userClips.length > 0) {
      const oldestClip = userClips[0];
      this.Clips.removeByCondition(
        (clip) => clip.title === oldestClip.title && clip.username === user
      );
    }
  }

  // Delete a specific Clip by title and username
  deleteClip(title, username) {
    this.Clips.removeByCondition(
      (clip) => clip.title === title && clip.username === username
    );
  }

  // Save Clips to a file
  saveClipsToFile(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.Clips.toArray(), null, 2));
  }

  // Load Clips from a file
  loadClipsFromFile(filePath) {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      const clips = JSON.parse(data);
      clips.forEach((clip) => this.addClip(clip));
    }
  }
}

module.exports = Clip;