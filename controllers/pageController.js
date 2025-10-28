const path = require('path');
const Clip = require('../models/clipModel');

// Initialize the Clip model
const clipModel = new Clip();

// Controller functions
exports.getPage = async (req, res) => {
  try {
    if (req.session.user) {
      const clips = await clipModel.getUserClips(req.session.user);
      res.render('index', { userclip: clips });
    } else {
      res.render('index');
    }
  } catch (error) {
    console.error('Error getting page:', error);
    res.render('index', { clipnotfound: 'An error occurred while loading clips' });
  }
};

exports.addClipboard = async (req, res) => {
  try {
    const clipboard = {
      // Prefer ISO timestamp (client will localize). Fall back to previous formatted string if present.
      time: res.locals.currentDateISO || res.locals.currentDateBangkok || "NULL",
      username: req.session.user || "Anonymous",
      title: req.body.title || req.body.clipboard?.substring(0, 20),
      description: req.body.clipboard || "No description"
    };

    if (!req.body.clipboard || req.body.clipboard.length > 2000) {
      return res.render('index', { clipnotfound: req.body.clipboard ? "Clipboard content is too long" : "Clipboard content is required" });
    }

    // Add the clip directly since MongoDB will handle the unique ID
    const newClip = await clipModel.addClip(clipboard);
    
    const clips = req.session.user ? await clipModel.getUserClips(req.session.user) : undefined;
    res.render('index', { clipid: newClip.ID, userclip: clips });
  } catch (error) {
    console.error('Error adding clipboard:', error);
    res.render('index', { clipnotfound: 'An error occurred while adding the clipboard' });
  }
};

exports.retrieveClipboard = async (req, res) => {
  try {
    const clipID = parseInt(req.body.retrieveID);
    const clip = await clipModel.getClipByID(clipID);
    
    if (!clip) return res.render('index', { clipnotfound: "NO CLIPBOARD FOUND!!" });

    const userclip = req.session.user ? await clipModel.getUserClips(req.session.user) : undefined;
    res.render('index', { 
      clipout: clip.description, 
      cliptitle: clip.title, 
      clipcurrentid: clip.ID, 
      userclip, 
      clipuname: clip.username 
    });
  } catch (error) {
    console.error('Error retrieving clipboard:', error);
    res.render('index', { clipnotfound: 'An error occurred while retrieving the clipboard' });
  }
};

exports.updateClipboard = async (req, res) => {
  try {
    const clipID = parseInt(req.body.clipcid);
    const newClip = req.body.output;
    const newTitle = req.body.title;

    if (!newClip) {
      return res.render('index', { clipnotfound: "Clipboard content is required" });
    } else if (newClip.length > 2000) {
      return res.render('index', { clipnotfound: "Clipboard content is too long" });
    }

    const clip = await clipModel.getClipByID(clipID);
    
    if (!clip) {
      return res.render('index', { clipnotfound: "NO CLIPBOARD FOUND!!" });
    }

    if (req.session.user !== clip.username) {
      return res.render('index', { clipnotfound: "You are not the owner of this clipboard" });
    }

    // Update the clip in MongoDB
    clip.description = newClip;
    clip.title = newTitle;
    await clipModel.updateClip(clipID, { title: newTitle, description: newClip });
    
    const userclip = await clipModel.getUserClips(req.session.user);
    res.render('index', { 
      clipout: newClip, 
      cliptitle: newTitle, 
      clipcurrentid: clipID, 
      userclip: userclip, 
      clipuname: clip.username 
    });
  } catch (error) {
    console.error('Error updating clipboard:', error);
    res.render('index', { clipnotfound: 'An error occurred while updating the clipboard' });
  }
};

exports.deleteClipboard = async (req, res) => {
  try {
    const { deleteIDs } = req.body;
    if (!deleteIDs) {
      const userClips = req.session.user ? await clipModel.getUserClips(req.session.user) : undefined;
      return res.render('index', { clipnotfound: "Clipboard content is required", userclip: userClips });
    }

    const idsToDelete = Array.isArray(deleteIDs) ? deleteIDs.map(id => parseInt(id)) : [parseInt(deleteIDs)];
    
    // ตรวจสอบการอนุญาตและลบ clip ทีละอัน
    for (const id of idsToDelete) {
      const clip = await clipModel.getClipByID(id);
      if (!clip || clip.username !== req.session.user) {
        const userClips = req.session.user ? await clipModel.getUserClips(req.session.user) : undefined;
        return res.render('index', { clipnotfound: "You are not the owner of one or more selected clipboards", userclip: userClips });
      }
      // ลบ clip ที่ผ่านการตรวจสอบแล้ว
      await clipModel.deleteClip(id);
    }

    const userClips = req.session.user ? await clipModel.getUserClips(req.session.user) : undefined;
    res.render('index', { userclip: userClips });
  } catch (error) {
    console.error('Error deleting clipboard:', error);
    res.render('index', { clipnotfound: 'An error occurred while deleting the clipboard' });
  }
};

exports.deleteFirstClipboard = async (req, res) => {
  try {
    const user = req.session.user;
    await clipModel.deleteFirstClip(user);
    const userClips = await clipModel.getUserClips(req.session.user);
    res.render('index', { userclip: userClips });
  } catch (error) {
    console.error('Error deleting first clipboard:', error);
    res.render('index', { clipnotfound: 'An error occurred while deleting the clipboard' });
  }
};

exports.deleteLastClipboard = async (req, res) => {
  try {
    const user = req.session.user;
    await clipModel.deleteLastClip(user);
    const userClips = await clipModel.getUserClips(req.session.user);
    res.render('index', { userclip: userClips });
  } catch (error) {
    console.error('Error deleting last clipboard:', error);
    res.render('index', { clipnotfound: 'An error occurred while deleting the clipboard' });
  }
};

exports.searchClipboard = async (req, res) => {
  try {
    const searchName = req.body.searchinput;
    const user = req.session.user;
    const foundClips = await clipModel.searchClipboardByName(searchName, user);
    res.render('index', { userclip: foundClips, searchinput: searchName });
  } catch (error) {
    console.error('Error searching clipboard:', error);
    res.render('index', { clipnotfound: 'An error occurred while searching clipboards' });
  }
};

exports.sortClipboard = async (req, res) => {
  try {
    const searchName = req.body.searchinput;
    const user = req.session.user;

    // Toggle sorting order
    if (req.session.isAscending === undefined) {
      req.session.isAscending = false; // Default to ascending on the first click
    } else {
      req.session.isAscending = !req.session.isAscending; // Toggle the sorting order
    }

    const clips = await clipModel.searchClipboardByName(searchName, user);
    const sortedClips = clips.sort((a, b) => {
      if (req.session.isAscending) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

    res.render('index', { userclip: sortedClips, searchinput: searchName });
  } catch (error) {
    console.error('Error sorting clipboard:', error);
    res.render('index', { clipnotfound: 'An error occurred while sorting clipboards' });
  }
};