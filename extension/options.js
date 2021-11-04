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
