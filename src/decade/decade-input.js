/** Pick any number between min and max */

'use strict';

module.exports = function(typeChecker) {
  const elem = document.createElement('input');
  elem.type = 'number';
  elem.placeholder = typeChecker.min + ' - ' + typeChecker.max;
  elem.min = typeChecker.min;
  elem.max = typeChecker.max;
  return elem;
};
