import os
import shutil

source_dir = 'comfy-output'
dest_dir = 'comfy-export'

os.makedirs(dest_dir, exist_ok=True)

for folder_name in os.listdir(source_dir):
    folder_path = os.path.join(source_dir, folder_name)
    if os.path.isdir(folder_path):
        image_path = os.path.join(folder_path, 'image.png')
        if os.path.exists(image_path):
            new_image_name = f"{folder_name}.png"
            new_image_path = os.path.join(dest_dir, new_image_name)
            shutil.copy(image_path, new_image_path)
