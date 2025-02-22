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
    // ID: req.body.ID ? req.body.ID : 408,
    ID: Math.floor(Math.random() * 9000) + 1000,
    Time: res.locals.currentDate ? res.locals.currentDate : "NULL",
    username: req.session.user ? req.session.user : "Anonymous",
    description: req.body.clipboard ? req.body.clipboard : "No description"
  };
  if (!req.body.clipboard) {
    return res.render('index', { clipnotfound: "Clipboard content is required" });
  } else if (req.body.clipboard.length > 2000) {
    return res.render('index', { clipnotfound: "Clipboard content is too long" });
  }

  if (req.session.user) {
    if (clipModel.Clips.some((clip) => clip.ID === clipboard.ID)) {
      this.addClipboard(req, res);
    }
    clipModel.addClip(clipboard);
    // console.log("new clipboard has been added");
    clipModel.saveClipsToFile(clipsFilePath);
    const clips = clipModel.getUserClips(req.session.user);
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
    const clip = clipModel.Clips.find((clip) => clip.ID == clipID);
    if (!clip) {
      return res.render('index', { clipnotfound: "NO CLIPBOARD FOUND!!" });
    }
    const userclip = clipModel.getUserClips(req.session.user);
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


