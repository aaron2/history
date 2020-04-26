var elasticsearch = require('@elastic/elasticsearch');
var lda = require('lda');
var stopwords = require('lda/lib/stopwords_en.js');
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
  //"docvalue_fields": [
  //  {
  //    "field": "visited",
  //    "format": "date_time"
  //  }
  //],
  "query": {
    "bool": {
      "must_not": [
        { "exists": { "field": "topic" }},
        { "term": { "category": "personal" }},
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
    if (doc._source.content == '' || doc._source.content == null) {
      return;
    }
    if (doc._source.category.includes('personal') || doc._source.category.includes('adult')) {
      return;
    }
    if (doc._source.category.includes('search')) {
      if (doc._source.domain.includes('google.com')) {
        topics = []
        doc._source.query.split('&').forEach(function(q) {
          if (q.startsWith('q=')) {
            q.split('=')[1].split('+').forEach(function(word) {
              if (!stopwords.stop_words.includes(q)) topics.push(word)
            });
          }
        });
        console.log(doc._source.link);
        console.log(topics);
        elasticClient.update({
          index: 'urls',
          id: doc._id,
          body: {
            doc: {
              "topic": topics
            }
          }
        })
        .catch(console.log);
      }
      return;
    }

    content = doc._source.content;
    //content = content.replace(/[’']([st]) /g, "$1 "); 
    //content = content.replace(/[“”‘]+/g, '"'); 
    //content = content.replace(/[\(\)\[\],]/g, ''); 
    content = content.replace(/\S+:\/\/\S+/g, ''); 
    content = content.replace(/\S+\.com\/\S*/g, ''); 
    //console.log(content);
    var s = content.match( /[^\.!\?]+[\.!\? ]+/g );
    var l = lda(s, 2, 5);
    console.log(doc._source.link);
    //console.log(l);
    topics = [];
    for (topic in l) {
      for (term in l[topic]) {
        topics.push(l[topic][term]['term'].replace(/['"“”‘’]/, ''));
      }
    }
    console.log(topics);

    await elasticClient.update({
      index: 'urls',
      id: doc._id,
      body: {
        doc: {
          "topic": topics
        }
      }
    })
    .catch(console.log);
  })
})
