const Media = require('../models/media');

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' });
    }

    const {
      durationSeconds,
      voiceTranscription,
    } = req.body;

    const media = await Media.create({
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      durationSeconds,
      voiceTranscription,
    });

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      media,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
    });
  }
};
