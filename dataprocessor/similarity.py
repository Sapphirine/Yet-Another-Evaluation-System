import indicoio
indicoio.config.api_key = 'b8cfad3e06d63c45f6d45f63f4bb9981'
from scipy.misc import imsave, imread
from indicoio import image_features
import json
import os

#read image
imagein = imread('input.jpg')
feature = image_features(imagein)

#initial
text = open('features.json').read()
dict = json.loads(text)
t = 0
maxnum = 5
maxnumdot = maxnum - 1

imagenumber = 10
max = []
minname = []
mindistance = []

#compare to find the similarity
for i in range(0, maxnumdot + 1):
    max.append(i)
    minname.append(dict[i][0])
    mindistance.append(0)
    for j in range(0, 2047 + 1):
        mindistance[i] = mindistance[i] + (dict[i][1][j] - feature[j]) * (dict[i][1][j] - feature[j])

for i in range(maxnum, (imagenumber -1) + 1):
    distance = 0
    for j in range(0, 2047 + 1):
        distance = distance + (dict[i][1][j] - feature[j]) * (dict[i][1][j] - feature[j])
    for k in range(0, maxnumdot + 1):
        d = mindistance[k]
        name = minname[k]
        if(distance < d):
            max.remove(max[k])
            max.append(i)
            mindistance.remove(d)
            mindistance.append(distance)
            minname.remove(name)
            minname.append(dict[i][0])
            break

#sort
for i in range(0, (maxnumdot-1) + 1):
    for j in range(i, maxnumdot + 1):
        if(mindistance[i] > mindistance[j]):
            c = mindistance[j]
            tmpname = minname[j]
            mindistance[j] = mindistance[i]
            minname[j] = minname[i]
            mindistance[i] = c
            minname[i] = tmpname

#delete '.jpg'
for i in range(0, maxnumdot + 1):
    l = len(minname[i])
    minname[i] = minname[i][0 : l - 4]

json.dump(minname, open('reviewname.json', 'wb'))