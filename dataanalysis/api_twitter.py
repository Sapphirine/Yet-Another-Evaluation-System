#!/usr/bin/env python
import twitter
import json

consumer_key = 'uXiwyTRTvUZVVvVJFaOF8Mi3z'
consumer_secret = 'v63cceAk1bf49SOtfi5eEwSjP1WqxM1QZuJyrm3mtVaJuIMgrO'
access_token_key = '3434544430-CDhp6QcGVRKs28AeIfJeGi6GXAjJxLe1bvBMW7X'
access_token_secret = 'qDOgdjATlYJYt0HT76I7YlPPf3Fr6wU8uy1T9uWuumWn7'


auth = twitter.oauth.OAuth(access_token_key, access_token_secret, consumer_key, consumer_secret)
twitter_api = twitter.Twitter(auth=auth)
print twitter_api

q = '#iPhone'
count = 1500
language = 'en'
search_results = twitter_api.search.tweets(q=q, lang = language, count=count)

statuses = search_results['statuses']

status_texts = [status['text'] for status in statuses]
# status_texts = [unicode(stat).encode('utf-8') for stat in status_texts]
# screen_names = [user_mention['screen_name'] for status in statuses for user_mention in status['entities']['user_mentions']]
# hashtags = [hashtag['text'] for status in statuses for hashtag in status['entities']['hashtags']]

words = [w for t in status_texts for w in t.split()]

print json.dumps(status_texts[0:100], indent=1)
# print json.dumps(screen_names[0:5], indent=1) 
# print json.dumps(hashtags[0:100], indent=1)
# print json.dumps(words[0:5], indent=1)
