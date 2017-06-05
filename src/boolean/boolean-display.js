/** Boolean label */

'use strict';

module.exports = {
  build: function() {
    const elem = document.createElement('span');
    elem.setAttribute('data-state', '');
    return elem;
  },
  update: function(elem, value) {
    elem.textContent = String(value);
    elem.setAttribute('data-state', String(value));
    // set to wrap
    elem.parentNode.setAttribute('data-state', String(value));
  }
};
