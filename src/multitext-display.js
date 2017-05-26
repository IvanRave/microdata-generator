'use strict';

module.exports = {
  build: function() {
    return document.createElement('ul');
  },
  update: function(elem, value) {
    elem.innerHTML = '';

    if (!value) { return; }

    const rows = value.split(';');

    if (!Array.isArray(rows)) {
      throw new Error('required_array_for_multitext: ' + value);
    }

    // TODO: optimize, using cloneNode
    rows.forEach(function(str) {
      const li = document.createElement('li');
      li.textContent = str;
      elem.appendChild(li);
    });
  }
};
