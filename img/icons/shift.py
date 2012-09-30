#!/usr/bin/env python
import os
from PIL import Image, ImageOps

path="."

target_height = 100

def limit(v):
    if v>255:
        v=255
    if v<0:
        v=0
    return int(v)


shift = {
    #""   : (1.50, 0.75, 0.75), #red
    "import"  : (1.30, 1.30, 0.50), # yellow
    "export"  : (1.50, 0.75, 0.50), # orange
    "direct"  : (0.50, 1.70, 0.50), # green
    "indirect": (0.60, 0.60, 1.70), # blue
}


def shift_image(image, shift):
    image = image.convert("RGBA")
    i = image.load()
    for x in range(image.size[0]):
        for y in range(image.size[1]):
            p = i[x,y]
            v = (p[0]+p[1]+p[2])/3
            i[x,y] = (
                limit(v * shift[0]),
                limit(v * shift[1]),
                limit(v * shift[2]),
                p[3]
            )
    return image

def shift_file(filename_in, filename_out, shift_key):
    image = Image.open(filename_in)
    image = shift_image(image, shift[shift_key])
    
    ratio = target_height/float(image.size[1])
    image = image.resize((int(image.size[0]*ratio),int(image.size[1]*ratio)) , Image.ANTIALIAS)
    
    image.save(filename_out)

def shift_files_in(path, shift_key):
    path_out = os.path.join(path, 'shift_'+shift_key)
    for filename in os.listdir(path):
        if filename.endswith('.png'):
            filename_in_absolute  = os.path.join(path    , filename)
            filename_out_absolute = os.path.join(path_out, filename)
            print("Converting %s to %s with %s" % (filename_in_absolute, filename_out_absolute, shift_key))
            try:
                os.makedirs(path_out)
            except:
                pass
            shift_file(filename_in_absolute, filename_out_absolute, shift_key)
    
for key in shift.keys():
    shift_files_in(path, key)

