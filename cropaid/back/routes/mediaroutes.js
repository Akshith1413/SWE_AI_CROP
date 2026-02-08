const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadVideo } = require('../controllers/mediacontroller');

router.post(
  '/upload-video',
  upload.single('video'),
  uploadVideo
);

module.exports = router;
