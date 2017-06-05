'use strict';

module.exports = {
  build: function() {
    return document.createElement('pre');
  },
  update: function(elem, value) {
    elem.innerHTML = '';

    if (!value) { return; }

    const code = document.createElement('code');
    code.textContent = value;
    elem.appendChild(code);
  }
};
