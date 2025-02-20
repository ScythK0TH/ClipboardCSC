const path = require('path');
const Clip = require('../models/clipModel');

// Initialize the Task model
const clipModel = new Clip();
const clipsFilePath = path.join(__dirname, '../ctext.json');

// Load tasks from file on app start
clipModel.loadClipsFromFile(clipsFilePath);

// Controller functions
exports.getPage = (req, res) => {
  res.render('index');
};

exports.addClipboard = (req, res) => {
  if (!req.body.clipboard) {
    return res.status(400).send('Clipboard content is required');
  } else {
    if (req.body.clipboard.length > 2000) {
      return res.status(400).send('Clipboard content is too long');
    }
  }
  const clipboard = {
    // ID: req.body.ID ? req.body.ID : 408,
    ID: req.body.ID ? req.body.ID : Math.floor(Math.random() * 9000) + 1000,
    UID: req.body.UID ? req.body.UID : "NULL",
    username: req.body.username ? req.body.username : "Anonymous",
    description: req.body.clipboard ? req.body.clipboard : "No description"
  };
  if (clipModel.Clips.some((clip) => clip.ID === clipboard.ID)) {
    this.addClipboard(req, res);
  }
  clipModel.addClip(clipboard);
  console.log("new clipboard has been added");
  clipModel.saveClipsToFile(clipsFilePath);
  res.render('index', { clipid: clipboard.ID });
}

exports.retrieveClipboard = (req, res) => {
  const clipID = req.body.retrieveID;
  const clip = clipModel.Clips.find((clip) => clip.ID == clipID);
  if (!clip) {
    return res.render('index', { clipnotfound: "NO CLIPBOARD FOUND!!" });
  }
  res.render('index', { clipout: clip.description });
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


