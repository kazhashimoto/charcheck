function save_options() {
  let obj = {};
  document.querySelectorAll('.item').forEach(e => {
    obj[e.id] = e.checked;
  });
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
    if ('options' in result) {
      const options = result.options;
      document.querySelectorAll('.item').forEach(e => {
        document.getElementById(e.id).checked = options[e.id];
      });
    }
  });
}

function reset_options() {
  document.querySelectorAll('.item').forEach(e => {
    e.checked = e.hasAttribute('checked');
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reset').addEventListener('click', reset_options);
