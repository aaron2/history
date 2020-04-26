var elasticsearch = require('@elastic/elasticsearch');
var c = require('../lib/url_classifier');

elasticClient = new elasticsearch.Client({
    node: 'http://localhost:9200',
    log: 'info'
});

var q = {
  "version": true,
  "size": 500,
  "sort": [
    {
      "visited": {
        "order": "desc",
        "unmapped_type": "boolean"
      }
    }
  ],
  "_source": {
    "excludes": []
  },
  "stored_fields": [
    "*"
  ],
  "query": {
    "bool": {
      "must": [],
      "filter": [
        {
          "match_all": {}
        }
      ],
      "must": [
        { "exists": { "field": "domain" }}
      ],
      "must_not": [
        { "exists": { "field": "category" }}
      ]
    }
  }
}

elasticClient.search({
  index: 'urls',
  body: q
})
.catch(console.log)
.then(function(res) {
  res.body.hits.hits.forEach(async function(doc) {
    newcats = c.classify(doc._source.domain);
    if (newcats.length == 0) {
      return;
    }
    console.log(newcats, doc._source.link);

    await elasticClient.update({
      index: 'urls',
      id: doc._id,
      body: {
        doc: {
          "category": newcats
        }
      }
    })
    .catch(console.log);
  })
})
