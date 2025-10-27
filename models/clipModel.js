const mongoose = require('mongoose');

// Define the Clip Schema
const clipSchema = new mongoose.Schema({
  ID: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  username: { type: String, required: true },
  time: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Create the Clip model
const ClipModel = mongoose.model('Clip', clipSchema);

class Clip {
  // Add a new Clip
  async addClip(clip) {
    try {
      const newClip = new ClipModel(clip);
      await newClip.save();
      return newClip;
    } catch (error) {
      throw error;
    }
  }

  // Get all Clips
  async getAllClips() {
    try {
      return await ClipModel.find().sort({ title: 1 });
    } catch (error) {
      throw error;
    }
  }

  // Get Clips for a specific user
  async getUserClips(username) {
    try {
      return await ClipModel.find({ username }).sort({ title: 1 });
    } catch (error) {
      throw error;
    }
  }

  // Search Clips by name and user
  async searchClipboardByName(name, user) {
    try {
      if (!user) return [];
      if (!name) return await this.getUserClips(user);

      return await ClipModel.find({
        title: { $regex: name, $options: 'i' },
        username: user
      }).sort({ title: 1 });
    } catch (error) {
      throw error;
    }
  }

  // Update a specific clip
  async updateClip(clipId, updateData) {
    try {
      return await ClipModel.findOneAndUpdate(
        { ID: clipId },
        updateData,
        { new: true } // This option returns the updated document
      );
    } catch (error) {
      throw error;
    }
  }

  // Delete the last Clip
  async deleteLastClip(user) {
    try {
      const userClips = await this.getUserClips(user);
      if (userClips.length > 0) {
        const lastClip = userClips[userClips.length - 1];
        await ClipModel.findOneAndDelete({ ID: lastClip.ID });
      }
    } catch (error) {
      throw error;
    }
  }

  // Delete the first Clip
  async deleteFirstClip(user) {
    try {
      const userClips = await this.getUserClips(user);
      if (userClips.length > 0) {
        const firstClip = userClips[0];
        await ClipModel.findOneAndDelete({ ID: firstClip.ID });
      }
    } catch (error) {
      throw error;
    }
  }

  // Delete a specific Clip
  async deleteClip(clipId) {
    try {
      await ClipModel.findOneAndDelete({ ID: clipId });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Clip;