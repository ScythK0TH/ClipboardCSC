const fs = require('fs');
const Encryption = require('../util');

util = new Encryption();

class Clip {
  constructor() {
    this.Clips = [];
  }

  // Add a new Clip
  addClip(Clip) {
    this.Clips.push(Clip);
  }

  // Get all Clips
  getAllClips() {
    //return this.Clips;
    return this.Clips.map((Clip) => this.encryptClip(Clip));
  }

  getUserClips(username) {
    return this.Clips.filter((Clip) => Clip.username === username);
  }

  searchClipboardByName(name, user) {
    if (!user) {
      return [];
    }
    if (!name) {
      return this.Clips.filter((Clip) => Clip.username === user);
    }
    return this.Clips.filter(
      (Clip) =>
        Clip.title.toLowerCase().includes(name.toLowerCase()) &&
        Clip.username === user
    );
  }

  sortAndSearchByName(name, user, isAscending) {
    const filteredClips = this.searchClipboardByName(name, user);
    return filteredClips.sort((a, b) => {
      const nameA = a.title.toLowerCase();
      const nameB = b.title.toLowerCase();
  
      // Use localeCompare for stable and consistent string comparison
      const comparison = nameA.localeCompare(nameB);
      
      // Return based on ascending or descending order
      return isAscending ? comparison : -comparison;
    });
  }

  // Delete the newest task
  deleteNewestClip(user) {
    const userClips = this.Clips.filter((clip) => clip.username === user);
    if (userClips.length > 0) {
      const newestClipIndex = this.Clips.lastIndexOf(userClips[userClips.length - 1]);
      this.Clips.splice(newestClipIndex, 1);
    }
  }

  // Delete the oldest task
  deleteOldestClip(user) {
    const userClips = this.Clips.filter((clip) => clip.username === user);
    if (userClips.length > 0) {
      const oldestClipIndex = this.Clips.indexOf(userClips[0]);
      this.Clips.splice(oldestClipIndex, 1);
    }
  }

  encryptClip(Clip) {
    return {
      ...Clip,
      username: util.encrypt(Clip.username),
    };
  }

  // Save Clips to a file
  saveClipsToFile(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.Clips, null, 2));
  }

  // Load Clips from a file
  loadClipsFromFile(filePath) {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      this.Clips = JSON.parse(data);
    }
  }
}

module.exports = Clip;
