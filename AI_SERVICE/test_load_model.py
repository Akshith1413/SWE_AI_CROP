import tensorflow as tf
import keras
import traceback
import os

MODEL_PATH = "model/crop_disease_model.keras"

print(f"TF Version: {tf.__version__}")
print(f"Keras Version: {keras.__version__}")
print(f"Model Path: {os.path.abspath(MODEL_PATH)}")

try:
    print("Attempting to load model...")
    model = keras.models.load_model(MODEL_PATH, compile=False)
    print("Model loaded successfully!")
except Exception as e:
    print("FAILED to load model with keras.models.load_model:")
    traceback.print_exc()

try:
    print("\nAttempting to load with tf.keras.models.load_model...")
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("Model loaded successfully with tf.keras!")
except Exception as e:
    print("FAILED to load with tf.keras.models.load_model:")
    traceback.print_exc()
