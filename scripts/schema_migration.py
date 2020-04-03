import json

fh = open('dumps/dump3.json')
for line in fh:
  line = json.loads(line)
  line['_source']['link'] = '{}://{}{}'.format(line['_source']['url']['protocol'], line['_source']['url']['domain'], line['_source']['url']['path'])
  if line['_source']['url']['query'] != '':
    line['_source']['link'] = '{}?{}'.format(line['_source']['link'], line['_source']['url']['query'])
  del(line['_source']['url']['domain'])
  try:
    del(line['_source']['url']['subdomain'])
  except:
    pass
  del(line['_source']['url']['fragment'])
  print(json.dumps(line))
