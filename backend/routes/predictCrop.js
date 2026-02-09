const express = require("express");
const router = express.Router();
const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");

// Use memory storage for processing the file directly
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/predict-crop", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        const formData = new FormData();
        // Append the buffer and specify filename
        formData.append("file", req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        // Current AI Service is running on port 5001 locally
        const aiServiceUrl = "http://localhost:5001/predict";

        const response = await axios.post(
            aiServiceUrl,
            formData,
            { headers: { ...formData.getHeaders() } }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error in prediction proxy:", error.message);
        if (error.response) {
            console.error("AI Service response:", error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: "Prediction failed", details: error.message });
        }
    }
});

module.exports = router;
