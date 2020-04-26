exports.set = function(req, res) {
  if (!req.body.url || !req.body.significance) {
    res.status(400).send({ status: 'error', error: 'missing required parameter' });
    return;
  }

  var uri = new global.uri(req.body.url.trim());

  var q = {
    "version": true,
    "size": 5,
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
        "must": [
          {
            "term": { "domain": uri.hostname() }
          },
          {
            "match": {
              "path": { "query": uri.path(), "operator": "AND" }
            }
          }
        ],
      }
    }
  }

  elasticClient.search({
    index: 'urls',
    body: q
  })
  .catch(console.log)
  .then(function(sr) {
    if (sr.body.hits.hits.length == 0) {
      res.status(204).send();
      return;
    }

    sr.body.hits.hits.forEach(function(doc) {
      console.log('significance', doc._source.link, req.body.significance);
      elasticClient.update({
        index: 'urls',
        id: doc._id,
        body: {
          doc: {
            significance: req.body.significance
          }
        }
      });
    });
    res.status(202).send();
  });
}

