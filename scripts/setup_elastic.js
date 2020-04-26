var elasticsearch = require('@elastic/elasticsearch');
var elasticClient = new elasticsearch.Client({
    node: 'http://localhost:9200',
    log: 'info'
});

elasticClient.indices.delete({
  index: "urls",
});

c = elasticClient.indices.create({
  index: "urls",
  body: {
    mappings: {
      properties: {
        link: { type: "keyword", index: false, doc_values: false },
        protocol: { type: "keyword", },
        domain: {
          type: "text",
          analyzer: "hostname_analyzer",
          search_analyzer: "keyword"
        },
        path: {
          type: "text",
          fields: {
            raw: { type: "keyword" }
          }
        },
        referrer: {
          properties: {
            referrer: { type: "keyword" },
            domain: { type: "keyword" },
          }
        },
        query: {
          type: "text",
          analyzer: "querystring_analyzer"
        },
        title: { type: "text", analyzer: "stop" },
        content: { type: "text", analyzer: "stop" },
        visited: { type: "date" },
        transition_type: { type: "keyword" },
        category: { type: "keyword" },
        topic: { type: "keyword" },
        significance: { type: "byte" },
      },
    },
    settings: {
      analysis: {
        analyzer: {
          hostname_analyzer: {
            type: "custom",
            filter: "lowercase",
            tokenizer: "hostname_tokenizer",
          },
          querystring_analyzer: {
            type: "custom",
            filter: [
              "lowercase",
              "asciifolding",
            ],
            tokenizer: "querystring_tokenizer"
          }
        },
        tokenizer: {
          hostname_tokenizer: {
            type: "path_hierarchy",
            delimiter: ".",
            reverse: true
          },
          querystring_tokenizer: {
            type: "pattern",
            pattern: "&"
          }
        }
      }
    }
  }
});

c.catch(err => console.log(err, err.meta.body.error))
