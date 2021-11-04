(function() {
  let options = {};

  const from_extension = (typeof chrome !== 'undefined' && chrome.extension);
  if (document.body.classList.contains('charcheck')) {
    if (!from_extension) {
      const el = document.querySelectorAll('script[src*="charcheck.js"]');
      if (el.length) {
        const last = el[el.length - 1];
        last.remove();
      }
    }
    document.body.classList.toggle('charcheck-done');
    return;
  }

  init_options();
  if (from_extension) {
    chrome.storage.sync.get('options', function(result) {
      if ('options' in result) {
        console.log('get', result.options);
        options = Object.assign({}, result.options);
        options.preset = false;
      }
      createCSSRules();
    });
  } else {
    createCSSRules();
  }

  function init_options() {
    const colors = ['tomato', '#fff100', 'violet', 'dodgerblue',
      'mediumseagreen', 'slateblue', 'orange'];
    // initialize options
    options.items = {};
    options.colors = {};
    for (let i = 1; i <= colors.length; i++) {
      options.items[`item${i}`] = true;
      options.colors[`color${i}`] = colors[i - 1];
    }
    options.preset = true;
  }

  function createCSSRules() {
    if (from_extension && options.preset) {
      return;
    }
    console.log('modify css rules');
    const colors = options.colors;
    const colorMap = new Map();
    colorMap.set('.__space', colors.color1)
      .set('.__fw-space', colors.color2)
      .set('.__digit', colors.color3)
      .set('.__alpha', colors.color4)
      .set('.__brackets', colors.color5)
      .set('.__punc', colors.color6)
      .set('.__fw-char', colors.color7);
    if (!from_extension) {
      colorMap.set('body:not(.charcheck-done) .__c ', 'transparent');
    }

    const s = document.createElement('style');
    let str = '';
    for (let [sel, val] of colorMap.entries()) {
      str += `${sel} { background-color: ${val}; } `;
    }
    if (!from_extension) {
      const cccc = '.__c.__c.__c.__c';
      str += `${cccc} { display: inline; } `;
      str += `${cccc}::before, ${cccc}::after { display: none; } `;
    }
    s.textContent = str;
    document.body.appendChild(s);
  }

  document.body.classList.add('charcheck', 'charcheck-done');

  const map = new Map();
  map.set('__space', /__SPACE{__([^_]+)__}__/)
    .set('__fw-space', /__FW_SPACE{__([^_]+)__}__/)
    .set('__digit', /__DIGIT{__([^_]+)__}__/)
    .set('__alpha', /__ALPHA{__([^_]+)__}__/)
    .set('__brackets', /__BRACKETS{__([^_]+)__}__/)
    .set('__punc', /__PUNC{__([^_]+)__}__/)
    .set('__fw-char', /__FW_CHAR{__([^_]+)__}__/);

   document.body
   .querySelectorAll(':not(style):not(script):not(link):not(iframe)')
   .forEach(function(element) {
    const text_nodes = Array.from(element.childNodes).filter(function(e) {
      if (e.nodeType === Node.TEXT_NODE) {
        return /[^\t\n\r ]/.test(this.data);
      }
      return false;
    });
    text_nodes.forEach(function(e) {
      e.nodeValue = e.nodeValue
                .replace(/([\t\n\r ]+)([^\t\n\r ])/g, '__SPACE{__$1__}__$2')
                .replace(/\u3000+/g, '__FW_SPACE{__$&__}__')
                .replace(/[０-９]+/g, '__DIGIT{__$&__}__')
                .replace(/[Ａ-Ｚａ-ｚ]+/g, '__ALPHA{__$&__}__')
                .replace(/[〈〉《》「」『』【】〔〕（）［］｛｝]+/g, '__BRACKETS{__$&__}__')
                .replace(/[、。！？・：；]+/g, '__PUNC{__$&__}__')
                .replace(/[\uFF0C\uFFE5]+/g, '__FW_CHAR{__$&__}__'); // FULLWIDTH COMMA, FULLWIDTH YEN SIGN
    });

    map.forEach(function(re, clsname) {
      matchText(element, new RegExp(re, 'g'), function(node, match, offset) {
        const str = match.replace(re, '$1');
        const span = document.createElement('span');
        span.classList.add('__c', clsname);
        span.textContent = str;
        return span;
      });
    });
  });

  // https://stackoverflow.com/questions/16662393/insert-html-into-text-node-with-javascript
  function matchText(node, regex, callback, excludeElements) {
      excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas']);
      let child = node.firstChild;

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
})();
