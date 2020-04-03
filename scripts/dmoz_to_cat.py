import json
import csv

out = {}
fh = open('dmoz_domain_category.csv')
for line in csv.reader(fh):
  out[line[0]] = line[1].split('/')

print(json.dumps(out))
