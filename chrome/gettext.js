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
        if (s !== "") {
          text += ' '+s;
        }
    }

    return text;
}

getText(document.body);
