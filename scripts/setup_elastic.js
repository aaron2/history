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
        url: {
          type: "object",
          properties: {
            protocol: {
              type: "keyword",
            },
            hostname: {
              type: "text",
              analyzer: "hostname_analyzer",
              search_analyzer: "keyword"
            },
            path: {
              type: "text"
            },
            query: {
              type: "text",
              analyzer: "querystring_analyzer"
            }
          }
        },
        link: { type: "text", index: false },
        visited: { type: "date" },
        transition_type: { type: "keyword" },
        category: { type: "keyword" },
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
