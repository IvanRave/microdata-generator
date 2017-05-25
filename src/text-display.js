'use strict';

module.exports = {
  build: function() {
    return document.createElement('span');
  },
  update: function(elem, value) {
    elem.textContent = value === null ? '' : (value + '');
  }
};
