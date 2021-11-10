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
  console.log('save: ', obj);
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
  chrome.storage.sync.get('options', function(result) {
    console.log(result);
    if ('options' in result) {
      const options = result.options;
      document.querySelectorAll('.item').forEach(e => {
        document.getElementById(e.id).checked = options.items[e.id];
      });
      document.querySelectorAll('.color').forEach(e => {
        document.getElementById(e.id).value = options.colors[e.id];
      });
      document.getElementById('same-color').checked = options.useSameColor;
      document.getElementById('color-default').value = options.defaultColor;
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
  document.querySelectorAll('.color').forEach(e => {
    const rgb = getRGB(e.value);
    console.log(rgb);
    const hsl = [];
    rgb2hsl(rgb, hsl);
    console.log('hsl', hsl);
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
    const hex = hsl2rgb(hsl);
    console.log('new:', hex);
    e.value = hex;
  });
}

document.getElementById('lightness-down').addEventListener('click', function() {
  set_lightness(-1);
});
document.getElementById('lightness-up').addEventListener('click', function() {
  set_lightness(1);
});

document.getElementById('reset-colors').addEventListener('click', preset_color_values);
