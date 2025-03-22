const path = require('path');
const Clip = require('../models/clipModel');

// Initialize the Task model
const clipModel = new Clip();
const clipsFilePath = path.join(__dirname, '../userclipboards.json');

// Load tasks from file on app start
clipModel.loadClipsFromFile(clipsFilePath);

// Controller functions
exports.getPage = (req, res) => {
  if (req.session.user) {
    const clips = clipModel.getUserClips(req.session.user);
    res.render('index', { userclip: clips });
  } else {
    res.render('index');
  }
};

exports.addClipboard = (req, res) => {
  const clipboard = {
    ID: Math.floor(Math.random() * 9000) + 1000,
    time: res.locals.currentDate || "NULL",
    username: req.session.user || "Anonymous",
    title: req.body.title || req.body.clipboard?.substring(0, 20),
    description: req.body.clipboard || "No description"
  };

  if (!req.body.clipboard || req.body.clipboard.length > 2000) {
    return res.render('index', { clipnotfound: req.body.clipboard ? "Clipboard content is too long" : "Clipboard content is required" });
  }

  if (!clipModel.Clips.some((clip) => clip.ID === clipboard.ID)) {
    clipModel.addClip(clipboard);
    clipModel.saveClipsToFile(clipsFilePath);
  }

  const clips = req.session.user ? clipModel.getUserClips(req.session.user) : undefined;
  res.render('index', { clipid: clipboard.ID, userclip: clips });
}

exports.retrieveClipboard = (req, res) => {
  const clipID = req.body.retrieveID;
  const clip = clipModel.Clips.find((clip) => clip.ID == clipID);
  if (!clip) return res.render('index', { clipnotfound: "NO CLIPBOARD FOUND!!" });

  const userclip = req.session.user ? clipModel.getUserClips(req.session.user) : undefined;
  res.render('index', { 
    clipout: clip.description, 
    cliptitle: clip.title, 
    clipcurrentid: clip.ID, 
    userclip, 
    clipuname: clip.username 
  });
}

exports.updateClipboard = (req, res) => {
  const clipID = req.body.clipcid;
  const newClip = req.body.output;
  const newTitle = req.body.title;

  if (!newClip) {
    return res.render('index', { clipnotfound: "Clipboard content is required" });
  } else if (newClip.length > 2000) {
    return res.render('index', { clipnotfound: "Clipboard content is too long" });
  }

  const clip = clipModel.Clips.find((clip) => clip.ID == clipID);
  if (!clip) {
    return res.render('index', { clipnotfound: "NO CLIPBOARD FOUND!!" });
  }

  if (req.session.user !== clip.username) {
    return res.render('index', { clipnotfound: "You are not the owner of this clipboard" });
  }

  clip.description = newClip;
  clip.title = newTitle;
  clipModel.saveClipsToFile(clipsFilePath);
  const userclip = clipModel.getUserClips(req.session.user);
  res.render('index', { clipout: clip.description, cliptitle: clip.title, clipcurrentid: clip.ID, userclip: userclip, clipuname: clip.username });
}

exports.deleteClipboard = (req, res) => {
  const { deleteIDs } = req.body;
  if (!deleteIDs) {
    return res.render('index', { clipnotfound: "Clipboard content is required", userclip: req.session.user ? clipModel.getUserClips(req.session.user) : undefined });
  }

  const idsToDelete = Array.isArray(deleteIDs) ? deleteIDs : [deleteIDs];
  clipModel.Clips = clipModel.Clips.filter((clip) => !idsToDelete.includes(clip.ID.toString()));
  clipModel.saveClipsToFile(clipsFilePath);

  res.render('index', { userclip: req.session.user ? clipModel.getUserClips(req.session.user) : undefined });
};

exports.searchClipboard = (req, res) => {
  const searchName = req.body.searchinput;
  const user = req.session.user;
  const foundClips = clipModel.searchClipboardByName(searchName, user);
  res.render('index', { userclip: foundClips, searchinput: searchName });
}

exports.sortClipboard = (req, res) => {
  const searchName = req.body.searchinput;
  const user = req.session.user;

  // Toggle sorting order
  if (req.session.isAscending === undefined) {
    req.session.isAscending = true; // Default to ascending on the first click
  } else {
    req.session.isAscending = !req.session.isAscending; // Toggle the sorting order
  }

  const sortedClips = clipModel.sortAndSearchByName(searchName, user, req.session.isAscending);
  res.render('index', { userclip: sortedClips, searchinput: searchName });
};