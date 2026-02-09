import zipfile
import json
import os

MODEL_PATH = "model/crop_disease_model.keras"

def extract_config():
    try:
        with zipfile.ZipFile(MODEL_PATH, 'r') as z:
            print("Files in archive:", z.namelist())
            if 'config.json' in z.namelist():
                with z.open('config.json') as f:
                    config = json.load(f)
                    print(json.dumps(config, indent=2))
            else:
                print("config.json not found in archive")

    except Exception as e:
        print(f"Error extracting config: {e}")

if __name__ == "__main__":
    extract_config()
