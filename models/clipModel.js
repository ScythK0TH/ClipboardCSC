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
    if (!name) {
      return this.Clips.filter((Clip) => Clip.username === user);
    }
    if (user) {
      return this.Clips.filter(
        (Clip) =>
          Clip.title.toLowerCase().includes(name.toLowerCase()) &&
          Clip.username === user
      );
    }
  }

  sortAndSearchByName(name, user, isAscending = true) {
    const filteredClips = this.searchClipboardByName(name, user);
    return filteredClips.sort((a, b) => {
      const nameA = a.title.toLowerCase();
      const nameB = b.title.toLowerCase();
      if (nameA < nameB) return isAscending ? -1 : 1;
      if (nameA > nameB) return isAscending ? 1 : -1;
      return 0;
    });
  }

  // Delete the newest task
  deleteNewestClip() {
    if (this.Clips.length > 0) {
      this.Clips.pop();
    }
  }

  // Delete the oldest task
  deleteOldestClip() {
    if (this.Clips.length > 0) {
      this.Clips.shift();
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
