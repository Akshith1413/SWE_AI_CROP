import tensorflow as tf
import os

MODEL_PATH = "model/crop_disease_model.keras"

def inspect_model():
    try:
        print(f"TensorFlow Version: {tf.__version__}")
        # Try loading with Keras 3 logic if applicable, or standard tf.keras
        try:
             model = tf.keras.models.load_model(MODEL_PATH)
        except Exception as e:
             print(f"Standard load failed: {e}")
             # If it's a keras 3 model, maybe we need to import keras directly
             import keras
             print(f"Keras Version: {keras.__version__}")
             model = keras.models.load_model(MODEL_PATH)

        print("\nModel Summary:")
        model.summary()
        
        print("\nInput Shape:")
        print(model.input_shape)

    except Exception as e:
        print(f"Error inspecting model: {e}")

if __name__ == "__main__":
    inspect_model()
