/** Pick any integer between min and max age */

'use strict';

module.exports = function() {
  const elem = document.createElement('input');
  elem.type = 'number';
  elem.placeholder = '0-120';
  return elem;
};
