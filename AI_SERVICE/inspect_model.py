import h5py
import json
import os

MODEL_PATH = "model/crop_disease_model.keras"

def inspect_h5():
    try:
        with h5py.File(MODEL_PATH, 'r') as f:
            print("Keys in H5 file:", list(f.keys()))
            if 'model_config' in f.attrs:
                config = f.attrs['model_config']
                print("\nModel Config (from attrs):")
                print(config)
            
    except Exception as e:
        print(f"Error inspecting H5: {e}")

if __name__ == "__main__":
    inspect_h5()
