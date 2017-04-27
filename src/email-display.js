'use strict';

module.exports = {
  build: function() {
    return document.createElement('span');
  },
  update: function(elem, value) {
    elem.innerHTML = '';
    if (!value) {
      console.log('optional_email: ' + elem.id);
      return;
    }

    const a = document.createElement('a');
    a.href = 'mailto:' + value;
    a.textContent = value;
    elem.appendChild(a);
  }
};
