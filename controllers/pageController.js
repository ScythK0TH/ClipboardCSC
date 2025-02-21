const path = require('path');
const Clip = require('../models/clipModel');
const uClip = require('../models/uclipModel');

// Initialize the Task model
const clipModel = new Clip();
const clipsFilePath = path.join(__dirname, '../anonymous.json');

const uclipModel = new uClip();
const uclipsFilePath = path.join(__dirname, '../userclipboard.json');

// Load tasks from file on app start
clipModel.loadClipsFromFile(clipsFilePath);
uclipModel.loadClipsFromFile(uclipsFilePath);

// Controller functions
exports.getPage = (req, res) => {
  if (req.session.user) {
    const clips = uclipModel.getUserClips(req.session.user);
    res.render('index', { userclip: clips });
  } else {
    res.render('index');
  }
};

exports.addClipboard = (req, res) => {
  const clipboard = {
    // ID: req.body.ID ? req.body.ID : 408,
    ID: Math.floor(Math.random() * 9000) + 1000,
    username: req.session.user ? req.session.user : "Anonymous",
    description: req.body.clipboard ? req.body.clipboard : "No description"
  };
  if (!req.body.clipboard) {
    return res.render('index', { clipnotfound: "Clipboard content is required" });
  } else if (req.body.clipboard.length > 2000) {
    return res.render('index', { clipnotfound: "Clipboard content is too long" });
  }

  if (req.session.user) {
    const clips = uclipModel.getUserClips(req.session.user);
    if (uclipModel.Clips.some((clip) => clip.ID === clipboard.ID)) {
      this.addClipboard(req, res);
    }
    uclipModel.addClip(clipboard);
    // console.log("new clipboard has been added");
    uclipModel.saveClipsToFile(uclipsFilePath);
    res.render('index', { clipid: clipboard.ID, userclip: clips });
  } else {
    if (clipModel.Clips.some((clip) => clip.ID === clipboard.ID)) {
      this.addClipboard(req, res);
    }
    clipModel.addClip(clipboard);
    // console.log("new clipboard has been added");
    clipModel.saveClipsToFile(clipsFilePath);
    res.render('index', { clipid: clipboard.ID });
  }
}

exports.retrieveClipboard = (req, res) => {
  const clipID = req.body.retrieveID;
  if (req.session.user) {
    const userclip = uclipModel.getUserClips(req.session.user);
    const clip = uclipModel.Clips.find((clip) => clip.ID == clipID);
    if (!clip) {
      return res.render('index', { clipnotfound: "NO CLIPBOARD FOUND!!" });
    }
    res.render('index', { clipout: clip.description, userclip: userclip });
  } else {
    const clip = clipModel.Clips.find((clip) => clip.ID == clipID);
    if (!clip) {
      return res.render('index', { clipnotfound: "NO CLIPBOARD FOUND!!" });
    }
    res.render('index', { clipout: clip.description });
  }
}
// exports.addTask = (req, res) => {
//   const task = {
//     name: req.body.name,
//     username: req.body.username,
//     description: req.body.description,
//     priority: req.body.priority
//   };
//   taskModel.addTask(task);
//   console.log("new task has been added");
//   taskModel.saveTasksToFile(tasksFilePath);
//   res.redirect('/');
// };


