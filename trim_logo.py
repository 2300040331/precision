from PIL import Image, ImageChops

def trim(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
    diff = ImageChops.difference(im, bg)
    # Add a fuzz factor
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

try:
    im = Image.open('assets/images/logo.png')
    trimmed_im = trim(im)
    trimmed_im.save('assets/images/logo.png')
    print("Image trimmed successfully.")
except Exception as e:
    print(f"Error: {e}")
