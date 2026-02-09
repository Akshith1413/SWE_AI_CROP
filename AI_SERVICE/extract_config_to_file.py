import zipfile
import json
import os

MODEL_PATH = "model/crop_disease_model.keras"
OUTPUT_PATH = "model_config_extracted.json"

def extract_config():
    try:
        if not os.path.exists(MODEL_PATH):
            print(f"Model file not found at {MODEL_PATH}")
            return

        with zipfile.ZipFile(MODEL_PATH, 'r') as z:
            if 'config.json' in z.namelist():
                with z.open('config.json') as f:
                    config = json.load(f)
                
                with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
                    json.dump(config, f, indent=2)
                print(f"Config extracted to {OUTPUT_PATH}")
            else:
                print("config.json not found in archive")

    except Exception as e:
        print(f"Error extracting config: {e}")

if __name__ == "__main__":
    extract_config()
