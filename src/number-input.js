/** Pick any number between min and max */

'use strict';

module.exports = function() {
  const elem = document.createElement('input');
  elem.type = 'number';
  elem.placeholder = 'Any number';
  return elem;
};
