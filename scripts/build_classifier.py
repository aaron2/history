import json

fh = open('domain_list')
domains = json.load(fh)
fh = open('domain_categories')
categories = json.load(fh)
out = {}
for d in domains:
  if d in categories:
    out[d] = categories[d]
  else:
    out[d] = ['uncategorized']

print(json.dumps(out, indent=4))

