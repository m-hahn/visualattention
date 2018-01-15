import numpy as np
import scipy.ndimage as ndimage
import matplotlib.pyplot as plt
import os
import imageio

files = os.listdir(".")

for image in files:
  if image.endswith("png") and not "blur" in image:
   img = ndimage.imread(image)
   img = ndimage.gaussian_filter(img, sigma=(10, 10, 0), order=0)
   imageio.imwrite(image+"-blur.png", img)

