const express = require('express');
const multer = require('multer')
const path = require('path')

const uploadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/bills')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  }),

  const uploadMedia = multer({
    storage: uploadStorage
  })

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World');
})

module.exports = router;