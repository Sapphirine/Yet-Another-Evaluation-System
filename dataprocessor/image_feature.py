import indicoio
indicoio.config.api_key = 'b8cfad3e06d63c45f6d45f63f4bb9981'
from scipy.misc import imsave, imread
from indicoio import image_features
import json
import os

# Compute image features for all images and save to json.
features = []
i = 0

path = 'image/'
for home, dirs, files in os.walk(path):
    for f in files:
        print i
        if(i>0):
            s = 'image/%s' %f
            filename = '%s' %f
            print(s)
            print(filename)
            img = imread(s)
            new = [filename,image_features(img)]
            features.append(new)
        i = i + 1

json.dump(features, open('features.json', 'wb'))