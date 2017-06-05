/** String input */

'use strict';

module.exports = function() {
  const elem = document.createElement('input');
  elem.type = 'text';
  elem.placeholder = 'text';
  return elem;
};
