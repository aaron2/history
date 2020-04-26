fs = require('fs');

categories = JSON.parse(fs.readFileSync('./data/domain_classification'));

exports.classify = function(fqdn) {
  if (fqdn in categories) {
    return categories[fqdn];
  }

  var d = fqdn.split('.');

  // its already second level so early return
  if (d.length <= 2) {
    return [];
  }

  var second_level = d.slice(-2).join('.');
  if (second_level in categories) {
    return categories[second_level];
  }

  // if tld is 2 chars check for third level in case its a country code
  if (d[d.length-1].length == 2 && d.length > 2) {
    var third_level = d.slice(-3).join('.');
    if (third_level in categories) {
      return categories[third_level];
    }
  }

  return [];
}
