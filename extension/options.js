function save_options() {
  let obj = {};
  const item_list = document.querySelectorAll('.item');
  item_list.forEach(e => {
    console.log(e);
    obj[e.id] = e.checked;
    console.log(e.id + ' is set to ' + e.checked);
  });
  chrome.storage.sync.set({items: obj}, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get('items', function(result) {
    console.log('options currently is: ', result);
    if ('items' in result) {
      const items = result.items;
      const item_list = document.querySelectorAll('.item');
      item_list.forEach(e => {
        console.log(e.id + ' currentry is ' + items[e.id]);
        document.getElementById(e.id).checked = items[e.id];
      });
    }
  });
}

function reset_options() {
  const item_list = document.querySelectorAll('.item');
  item_list.forEach(e => {
    e.checked = e.hasAttribute('checked');
    console.log('checked --> ', e.checked);
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reset').addEventListener('click', reset_options);
