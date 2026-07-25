import os
import json
import requests
from pathlib import Path

def download_image(url, save_path):
    if url.startswith('/'):
        url = f"https://id-preview--67c9632c-4632-4628-95f6-0aa137afde31.lovable.app{url}"
    try:
        response = requests.get(url, timeout=15)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            print(f"Downloaded: {save_path}")
            return True
        else:
            print(f"Failed {url}: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

# ID 17 (Bianco Panelas)
base_path = Path("public/assets/products-bc/panelas")
dest_path = Path("public/assets/products-bc/bianco-v1")
dest_path.mkdir(parents=True, exist_ok=True)
files = ["img-1.asset.json", "img-2.asset.json", "img-3.asset.json", "img-4.asset.json", "img-5.asset.json"]
for i, filename in enumerate(files):
    json_path = base_path / filename
    if json_path.exists():
        with open(json_path, 'r') as f:
            data = json.load(f)
            url = data.get('url')
            if url:
                download_image(url, dest_path / f"img-{i+1}.png")

# ID 24 (New Panelas variants)
base_path_v2 = Path("public/assets/products-bc/panelas-v2")
files_v2 = ["sahara", "preto-trad", "prestigio", "menta", "preto-gold"]
for filename in files_v2:
    json_path = base_path_v2 / f"{filename}.asset.json"
    if json_path.exists():
        with open(json_path, 'r') as f:
            data = json.load(f)
            url = data.get('url')
            if url:
                download_image(url, base_path_v2 / f"{filename}.jpg")
