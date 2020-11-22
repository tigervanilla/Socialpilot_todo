const express = require("express");
const multer = require("multer");
const path = require("path");
const taskCtrl = require("../controllers/task_controller");

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

const uploadMedia = multer({
  storage: uploadStorage,
});

const router = express.Router();

router.post("/new", uploadMedia.single("attachment"), taskCtrl.addTask);
router.get("/tasks/page/:pageNumber", taskCtrl.getTasksPaginated);

module.exports = router;
