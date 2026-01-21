import os
from PIL import Image

def resize_logo():
    source_path = r"e:\dev\trustplugins\assets\logo.png"
    assets_dir = r"e:\dev\trustplugins\assets"
    
    if not os.path.exists(source_path):
        print(f"Error: {source_path} not found.")
        return

    try:
        with Image.open(source_path) as img:
            # Resize to 192x192
            img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
            img_192.save(os.path.join(assets_dir, "favicon-192.png"))
            print("Created favicon-192.png")

            # Resize to 48x48
            img_48 = img.resize((48, 48), Image.Resampling.LANCZOS)
            img_48.save(os.path.join(assets_dir, "favicon-48.png"))
            print("Created favicon-48.png")
            
            # Create favicon.ico (multi-size)
            img.save(os.path.join(r"e:\dev\trustplugins", "favicon.ico"), sizes=[(16,16), (32,32), (48,48), (64,64)])
            print("Created favicon.ico")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    resize_logo()
