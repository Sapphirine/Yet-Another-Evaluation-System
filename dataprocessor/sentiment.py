import indicoio
indicoio.config.api_key = 'b8cfad3e06d63c45f6d45f63f4bb9981'
from indicoio import sentiment
from indicoio import keywords
import json

text = open('reviewname.json').read()
reviewname = json.loads(text)
SimilarImageNum = 5
SimilarImageNumdot = SimilarImageNum - 1
valuereviewnum = 5
valuereviewnumdot = valuereviewnum - 1

#initial
maxi = []
maxj = []
maxsenti = []
averagerate = 0
averagesentiment = 0
num = 0
positivenum = 0
middlenum = 0
negativenum = 0
keyreview = []

#sentiment
for i in range(0, SimilarImageNumdot + 1):
    #amazon
    
    f = reviewname[i]
    s = 'amazon/%s' %f
    text = open(s).read()
    dict = json.loads(text)
    l = len(dict)
    for j in range(0, (l - 1) + 1):
#        asin = dict[j]["asin"]
        reviewText = dict[j]["reviewText"]
        keyreview.append(reviewText)
        overall = dict[j]["overall"]
#        reviewTime = dict[j]["reviewTime"]
        averagerate = averagerate + overall
        senti = sentiment(reviewText)
        if(senti >= 0.66):
            positivenum = positivenum + 1
        elif(senti >= 0.33):
            middlenum = middlenum + 1
        else:
            negativenum = negativenum + 1
        averagesentiment = averagesentiment + senti
        num = num + 1
        maxi.append(i)
        maxj.append(j)
        maxsenti.append(senti)

#calculate the average
averagerate = averagerate / num
averagesentiment = averagesentiment / num
#print averagerate
#print averagesentiment

#sort
for i in range(0, (num-2) + 1):
    for j in range(i, (num-1) + 1):
        if(maxsenti[i] < maxsenti[j]):
            c = maxsenti[j]
            tmpmaxi = maxi[j]
            tmpmaxj = maxj[j]
            
            maxsenti[j] = maxsenti[i]
            maxi[j] = maxi[i]
            maxj[j] = maxj[i]
            
            maxsenti[i] = c
            maxi[i] = tmpmaxi
            maxj[i] = tmpmaxj

#pick the review into valuereview.json([asin, reviewText, overall, reviewTime, senti])
positivereviewinfile = []
for i in range(0, valuereviewnumdot + 1):
    f = reviewname[maxi[i]]
    s = 'amazon/%s' %f
    text = open(s).read()
    dict = json.loads(text)
    asin = dict[maxj[i]]["asin"]
    reviewText = dict[maxj[i]]["reviewText"]
    overall = dict[maxj[i]]["overall"]
    reviewTime = dict[maxj[i]]["reviewTime"]
    reviewadd = [asin, reviewText, overall, reviewTime, maxsenti[i]]
    positivereviewinfile.append(reviewadd)
json.dump(positivereviewinfile, open('positivereview.json', 'wb'))

negativereviewinfile = []
for i in range((num - 1), (num - valuereviewnum - 1) , -1):
    #print i
    f = reviewname[maxi[i]]
    s = 'amazon/%s' %f
    text = open(s).read()
    dict = json.loads(text)
    asin = dict[maxj[i]]["asin"]
    reviewText = dict[maxj[i]]["reviewText"]
    overall = dict[maxj[i]]["overall"]
    reviewTime = dict[maxj[i]]["reviewTime"]
    reviewadd = [asin, reviewText, overall, reviewTime, maxsenti[i]]
    negativereviewinfile.append(reviewadd)
json.dump(negativereviewinfile, open('negativereview.json', 'wb'))

#keyvalue = [averagerate, averagesentiment, num, positivenum, middlenum, negativenum]
keyvalue = []
keyvalue.append(averagerate)
keyvalue.append(averagesentiment)
keyvalue.append(num)
keyvalue.append(positivenum)
keyvalue.append(middlenum)
keyvalue.append(negativenum)

json.dump(keyvalue, open('keyvalue.json', 'wb'))

#print maxi
#print maxj
#print maxsenti
#print positivenum
#print negativenum
#print num


keyw = keywords(keyreview)
json.dump(keyw, open('keyw.json', 'wb'))
