function save_options() {
  const item_list = document.querySelectorAll('.item');
  item_list.forEach(e => {
    console.log(e);
    let obj = {};
    obj[e.id] = e.checked;
    chrome.storage.sync.set(obj, function() {
      console.log(e.id + ' is set to ' + e.checked);
    });
  });
}

function restore_options() {
  const item_list = document.querySelectorAll('.item');
  item_list.forEach(e => {
    console.log(e);
    chrome.storage.sync.get([e.id], function(result) {
      console.log(e.id + ' currentry is ' + result[e.id])
      document.getElementById(e.id).checked = result[e.id];
    });
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
