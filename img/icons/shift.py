#!/usr/bin/env python
import os
from PIL import Image, ImageOps

path="."

def limit(v):
    if v>255:
        v=255
    if v<0:
        v=0
    return int(v)


shift = {
    "red"   : (1.50, 0.75, 0.75),
    "yellow": (1.25, 1.25, 0.50),
    "green" : (0.75, 1.50, 0.50),
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

