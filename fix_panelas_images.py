import os
import json
import requests
from pathlib import Path

def download_image(url, save_path):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            print(f"Downloaded: {save_path}")
            return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

# Paths for ID 17 (Bianco Panelas)
base_path = Path("public/assets/products-bc/panelas")
dest_path = Path("public/assets/products-bc/bianco-v1")
dest_path.mkdir(parents=True, exist_ok=True)

# Files for ID 17
files = ["img-1.asset.json", "img-2.asset.json", "img-3.asset.json", "img-4.asset.json", "img-5.asset.json"]

for i, filename in enumerate(files):
    json_path = base_path / filename
    if json_path.exists():
        with open(json_path, 'r') as f:
            data = json.load(f)
            url = data.get('url')
            if url:
                download_image(url, dest_path / f"img-{i+1}.jpg")

