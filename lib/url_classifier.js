fs = require('fs');

categories = JSON.parse(fs.readFileSync('./data/domain_classification'));

exports.classify = function(hostname, domain) {
  if (hostname in categories) {
    return categories[hostname];
  }
  if (domain in categories) {
    return categories[domain];
  }
  return [];
}
