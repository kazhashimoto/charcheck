// https://stackoverflow.com/questions/16662393/insert-html-into-text-node-with-javascript
var matchText = function(node, regex, callback, excludeElements) {

    excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas']);
    var child = node.firstChild;

    while (child) {
        switch (child.nodeType) {
        case 1:
            if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1)
                break;
            matchText(child, regex, callback, excludeElements);
            break;
        case 3:
            var bk = 0;
            child.data.replace(regex, function(all) {
                var args = [].slice.call(arguments),
                    offset = args[args.length - 2],
                    newTextNode = child.splitText(offset+bk), tag;
                bk -= child.data.length + all.length;

                newTextNode.data = newTextNode.data.substr(all.length);
                tag = callback.apply(window, [child].concat(args));
                child.parentNode.insertBefore(tag, newTextNode);
                child = newTextNode;
            });
            regex.lastIndex = 0;
            break;
        }

        child = child.nextSibling;
    }

    return node;
};


(function() {
  if (typeof jQuery === 'undefined') {
    alert('jQuery is not loaded.');
    return;
  }
  if ($('body').hasClass('charcheck')) {
    $('script[src*="charcheck.js"]').last().remove();
    $('body').toggleClass('charcheck-done');
    return;
  }
  const script = (function() {
    if (document.currentScript) {
      return document.currentScript;
    }
    return document.querySelector('script[src$="/js/charcheck.js"]');
  })();
  let css_url = 'https://cdn.jsdelivr.net/gh/kazhashimoto/charcheck@1.0.2/css/charcheck.css';   // fall back
  if (script && script.src && script.src.match(/\/js\/charcheck.js$/)) {
    css_url = script.src.replace(/\/js\/charcheck.js$/, '/css/charcheck.css');
  }
  $('<link>').attr({
    rel: 'stylesheet',
    href: css_url,
    media: 'all'
  }).appendTo('body');

  $('body').addClass('charcheck charcheck-done');

  $('body :not(script):not(link):not(iframe):not(pre)').each(function() {
    const text = $(this).contents().filter(function() {
      if (this.nodeType === Node.TEXT_NODE) {
        if (this.wholeText.match(/^[\n\r\t ]+$/)) {
          return false;
        }
        return true;
      }
      return false;
    });
    text.each(function() {
      this.nodeValue = this.nodeValue
                .replace(/[\n\r\t ]+([\w!-/:-@[-`{-~])/g, '__SPACE__$1')
                .replace(/([\w!-/:-@[-`{-~])[\n\r\t ]+/g, '$1__SPACE__')
                .replace(/([\u0080-\uEFFFF])[ \t]+([\u0080-\uEFFFF])/g, '$1__SPACE__$2')
                .replace(/\u3000+/g, '__FW_SPACE{__$&__}__')
                // .replace(/([\u0080-\uEFFFF])\s+([\u0080-\uEFFFF])/g, '$1$2')
                .replace(/ /g, '__SPACE__')
                .replace(/[０-９]+/g, '__DIGIT{__$&__}__')
                .replace(/[Ａ-Ｚａ-ｚ]+/g, '__ALPHA{__$&__}__')
                .replace(/[〈〉《》「」『』【】〔〕（）［］｛｝]+/g, '__BRACKETS{__$&__}__')
                .replace(/[、。！？・：；]+/g, '__PUNC{__$&__}__')
                .replace(/[，]+/g, '__FW_CHAR{__$&__}__'); // fullwidth comma
    });
    matchText(this, new RegExp(/__SPACE__/, 'g'), function(node, match, offset) {
      const obj = $('<span>').addClass('__c __space').text(' ');
      return obj.get(0);
    });
    matchText(this, new RegExp(/__FW_SPACE{__[^_]+__}__/, 'g'), function(node, match, offset) {
      const str = match.replace(/__FW_SPACE{__([^_]+)__}__/, '$1');
      const obj = $('<span>').addClass('__c __fw-space').text(str);
      return obj.get(0);
    });
    matchText(this, new RegExp(/__DIGIT{__[^_]+__}__/, 'g'), function(node, match, offset) {
      const str = match.replace(/__DIGIT{__([^_]+)__}__/, '$1');
      const obj = $('<span>').addClass('__c __digit').text(str);
      return obj.get(0);
    });
    matchText(this, new RegExp(/__ALPHA{__[^_]+__}__/, 'g'), function(node, match, offset) {
      const str = match.replace(/__ALPHA{__([^_]+)__}__/, '$1');
      const obj = $('<span>').addClass('__c __alpha').text(str);
      return obj.get(0);
    });
    matchText(this, new RegExp(/__BRACKETS{__[^_]+__}__/, 'g'), function(node, match, offset) {
      const str = match.replace(/__BRACKETS{__([^_]+)__}__/, '$1');
      const obj = $('<span>').addClass('__c __brackets').text(str);
      return obj.get(0);
    });
    matchText(this, new RegExp(/__PUNC{__[^_]+__}__/, 'g'), function(node, match, offset) {
      const str = match.replace(/__PUNC{__([^_]+)__}__/, '$1');
      const obj = $('<span>').addClass('__c __punc').text(str);
      return obj.get(0);
    });
    matchText(this, new RegExp(/__FW_CHAR{__[^_]+__}__/, 'g'), function(node, match, offset) {
      const str = match.replace(/__FW_CHAR{__([^_]+)__}__/, '$1');
      const obj = $('<span>').addClass('__c __fw-char').text(str);
      return obj.get(0);
    });
  });
})();
