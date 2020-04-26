function getPageData() {
  return {
    referrer: document.referrer,
    title: document.title,
    text: getText(document.body)
  };
}

function getText(el) {
    return walkNodeTree(el, {
        inspect: n => !['STYLE', 'SCRIPT', 'SVG', 'IFRAME', 'NOSCRIPT'].includes(n.nodeName.toUpperCase()),
        collect: n => (n.nodeType === 3)
    });
}

function walkNodeTree(root, options) {
    options = options || {};

    const inspect = options.inspect || (n => true),
          collect = options.collect || (n => true);
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ALL,
        {
            acceptNode: function(node) {
                if(!inspect(node)) { return NodeFilter.FILTER_REJECT; }
                if(!collect(node)) { return NodeFilter.FILTER_SKIP; }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    var text = '';
    let n;
    while(n = walker.nextNode()) {
        s = n.textContent.trim();
        if (ignore(s)) {
          continue;
        }
        //console.log(s.length, s);
        text += ' '+s;
    }
    //console.log(text);
    return text;
}

function ignore(s) {
  if (s.length > 25) {
    return false;
  }
  if (s.length <= 2) {
    return true;
  }

  s = s.toLowerCase();

  var ignore = ['facebook', 'twitter', 'pocket', 'linkedin', 'reddit', 'login', 'log in', 'sign up', 'social', 'share', 'sharing', 'comment', 'cookie', 'privacy', 'skip', 'new window', 'terms', 'search'];

  for (term in ignore) {
    if (s.includes(ignore[term])) {
      //console.log('ignore', s);
      return true;
    }
  }
  return false;
}

getPageData();
