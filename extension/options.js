function save_options() {
  let obj = {
    items: {},
    colors: {}
  };
  document.querySelectorAll('.item').forEach(e => {
    obj.items[e.id] = e.checked;
  });
  document.querySelectorAll('.color').forEach(e => {
    obj.colors[e.id] = e.value;
  });
  console.log('save: ', obj);
  chrome.storage.sync.set({options: obj}, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
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
function name2hex(name) {
  const div = document.createElement('div');
  div.style.color = name;
  document.body.appendChild(div);

  const cat = (p, c) => p + c;
  const style = window.getComputedStyle(div);
  const found = style.color.match(/rgba?\((.+)\)/);
  const rgba = found[1].split(',')
    .map((v, i) => {
      let x = +v.trim();
      if (i === 3) {
        x = Math.round(255 * x);
      }
      let hex = x.toString(16);
      if (x < 16) {
        hex = '0' + hex;
      }
      return hex;
    }).reduce(cat, '#');

  document.body.removeChild(div);
  return rgba;
}

const colors = [
  'tomato', '#fff100', 'violet', 'dodgerblue',
  'mediumseagreen', 'slateblue', 'orange'
];

document.querySelectorAll('.color').forEach((e, i) => {
  console.log(e, i);
  e.value = name2hex(colors[i]);
});
