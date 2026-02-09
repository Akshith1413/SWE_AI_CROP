from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from predictor import predict_disease
import os
import traceback # Added for traceback.print_exc()

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded!"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected!"}), 400

    try:
        print(f"Received prediction request for: {file.filename}")
        img_bytes = file.read()
        
        # Check if file.read() actually returned data
        if not img_bytes:
            return jsonify({"error": "Uploaded file is empty!"}), 400
            
        disease, confidence = predict_disease(img_bytes)
        print(f"Prediction result: {disease} ({confidence}%)")
        
        return jsonify({
            "disease": disease,
            "confidence": confidence
        })
    except Exception as e:
        print(f"Error processing request: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting AI Service on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
