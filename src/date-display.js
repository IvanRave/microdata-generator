/** Date as a string: YYYY-MM */

'use strict';

const convertIsoDate = function(isoDate) {
  return isoDate.substring(0, 7);
};

module.exports = {
  build: function() {
    return document.createElement('span');
  },
  update: function(elem, value) {
    if (value === null) {
      elem.removeAttribute('content');
      elem.textContent = '';
    } else {
      elem.setAttribute('content', value);
      elem.textContent = convertIsoDate(value);
    }
  }
};
