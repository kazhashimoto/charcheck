function save_options() {
  let obj = {
    items: {},
    colors: {},
    useSameColor: false,
    defaultColor: document.getElementById('color-default').getAttribute('value')
  };
  document.querySelectorAll('.item').forEach(e => {
    obj.items[e.id] = e.checked;
  });
  document.querySelectorAll('.color').forEach(e => {
    obj.colors[e.id] = e.value;
  });
  obj.useSameColor = document.getElementById('same-color').checked;
  obj.defaultColor = document.getElementById('color-default').value;
  chrome.storage.sync.set({options: obj}, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = '設定を保存しました。';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

const classes = [
  '__space', '__fw-space', '__digit', '__alpha', '__brackets',
  '__punc', '__fw-char'
];

function preset_color_values() {
  document.querySelectorAll('.color').forEach((e, i) => {
    const div = document.createElement('div');
    div.classList.add(classes[i]);
    div.style.display = 'none';
    document.body.appendChild(div);

    const style = window.getComputedStyle(div);
    e.value = name2hex(style.backgroundColor);
    document.body.removeChild(div);
  });
}

function restore_options() {
  preset_color_values();
  update_preview();
  chrome.storage.sync.get('options', function(result) {
    if ('options' in result) {
      const options = result.options;
      document.querySelectorAll('.item').forEach(e => {
        e.checked = options.items[e.id];
      });
      document.querySelectorAll('.color').forEach(e => {
        e.value = options.colors[e.id];
      });
      document.getElementById('same-color').checked = options.useSameColor;
      document.getElementById('color-default').value = options.defaultColor;

      update_preview();
    }
  });
}

function select_all() {
  let state = this.checked;
  document.querySelectorAll('.item').forEach(e => {
    e.checked = state;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

document.getElementById('select-all').addEventListener('click', select_all);

// colors
function set_lightness(value) {
  document.querySelectorAll('.color, #color-default').forEach(e => {
    const rgb = getRGB(e.value);
    const hsl = [];
    rgb2hsl(rgb, hsl);
    let l = hsl[2];
    if (value > 0) {
      if (l > 90) {
        return;
      }
      l = Math.min(l + 10, 90);
    } else {
      if (l < 10) {
        return;
      }
      l = Math.max(l - 10, 10);
    }
    hsl[2] = l;
    e.value = hsl2rgb(hsl);
  });
  update_preview();
}

document.getElementById('lightness-down').addEventListener('click', function() {
  set_lightness(-1);
});
document.getElementById('lightness-up').addEventListener('click', function() {
  set_lightness(1);
});

document.getElementById('reset-colors').addEventListener('click', function() {
   preset_color_values();
   update_preview();
});

function embed_tags(target) {
  let text = target.innerHTML;
  const enclose = function(match) {
    return `<span class="${this}">${match}</span>`;
  };
  text = text.replace(/ /g, enclose.bind('__space'))
          .replace(/\u3000+/g, enclose.bind('__fw-space'))
          .replace(/[０-９]+/g, enclose.bind('__digit'))
          .replace(/[Ａ-Ｚａ-ｚ]+/g, enclose.bind('__alpha'))
          .replace(/[「」]/g, enclose.bind('__brackets'))
          .replace(/[、。！？・：；]+/g, enclose.bind('__punc'))
          .replace(/[\uFF0C\uFFE5\uFF0D]+/g, enclose.bind('__fw-char'));

  target.innerHTML = text;
}

function update_preview() {
  const p = document.querySelector('.sample-text');
  if (!p.classList.contains('done')) {
    embed_tags(p);
    p.classList.add('done');
  }
  p.querySelectorAll('span').forEach(e => {
    const x = classes.indexOf(e.classList[0]);
    if (x >= 0) {
      const item = document.getElementById(`item${x + 1}`);
      let picker = document.getElementById(`color${x + 1}`);
      if (document.getElementById('same-color').checked) {
        picker = document.getElementById('color-default');
      }
      e.style.backgroundColor = item.checked? picker.value: 'transparent';
    }
  });
}

document.querySelectorAll('.item, .color, #select-all, #same-color, #color-default').forEach(e => {
  e.addEventListener('change', update_preview);
});
