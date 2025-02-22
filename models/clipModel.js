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

  searchByName(name) {
    const foundClips = this.Clips
      .filter((Clip) => Clip.name.toLowerCase().includes(name.toLowerCase()))
      .map((Clip) => this.encryptClip(Clip));
    return foundClips;
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
