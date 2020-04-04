exports.add = function(req, res) {
  if (!req.body.url) {
    res.status(400).send({ status: 'error', error: 'missing required parameter' });
    return;
  }

  if (req.body.transition_type == 'reload') {
    res.status(200).send();
    return;
  }


  var uri = new global.uri(req.body.url.trim());
  //if (!user) return uri.normalize().toString();

  if (uri.protocol() == '') {
    res.status(400).send();
    return;
  }

  protocol_filter = ['http', 'https'];
  if (!protocol_filter.includes(uri.protocol())) {
    res.status(200).send();
    return;
  }

  cat = global.url_classifier.classify(uri.hostname(), uri.domain());
  if (cat.includes('adult')) {
    res.status(200).send();
    return;
  }
  if (cat.includes('personal')) {
    req.body.text = '';
  }

  console.log(cat, uri.normalize().toString());
  elasticClient.index({
    index: 'urls',
    body: {
      protocol: uri.protocol(),
      domain: uri.hostname(),
      path: uri.path(),
      query: uri.query(),
      title: req.body.title,
      content: req.body.text,
      link: uri.normalize().toString(),
      visited: parseInt(new Date().getTime()),
      transition_type: req.body.transition_type,
      category: cat,
    },
  }).catch(function(err) {
    console.log(err);
    res.status(400).send();
    return;
  });
  res.status(201).send();
}

