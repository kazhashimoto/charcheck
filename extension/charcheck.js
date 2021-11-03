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

  if (from_extension) {
    // chrome.storage.sync.get('options', function(result) {
    //   if ('options' in result) {
    //     console.log('get', result.options);
    //     options = Object.assign({}, result.options);
    //   }
    // });
    loadOptions();
    console.log('load: ', options);
  }

  async function loadOptions() {
    const result = await chrome.storage.sync.get('options');
    if ('options' in result) {
      console.log('get', result.options);
      options = Object.assign({}, result.options);
    }
  }

  if (!Object.keys(options).length) {
    const colors = ['red', 'blue', 'lime', 'yellow', 'magenta',
      'mediumpurple', 'mediumspringgreen'];
    // initialize options
    options.items = {};
    options.colors = {};
    for (let i = 1; i <= 7; i++) {
      options.items[`item${i}`] = true;
      options.colors[`color${i}`] = colors[i - 1];
    }
    options.preset = true;
  }
  console.log('final: ', options);

  function createCSSRules() {
    if (from_extension && options.preset) {
      return;
    }
    const colors = options.colors;
    const colorMap = new Map();
    colorMap.set('.__space', colors.color1/* 'red'*/)
      .set('.__fw-space', colors.color2/*'blue'*/)
      .set('.__digit', colors.color3/*'lime'*/)
      .set('.__alpha', colors.color4/*'yellow'*/)
      .set('.__brackets', colors.color5/*'magenta'*/)
      .set('.__punc', colors.color6/*'mediumpurple'*/)
      .set('.__fw-char', colors.color7/*'mediumspringgreen'*/);
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
      s.textContent = str;
    }
    document.body.appendChild(s);
  }

  createCSSRules();

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
