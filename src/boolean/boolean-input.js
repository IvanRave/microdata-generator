/** Checkbox */

'use strict';

module.exports = function() {
  const elem = document.createElement('input');
  elem.type = 'checkbox';

  setTimeout(function() {
    const div = document.createElement('div');
    div.appendChild(document.createElement('div'));
    elem.parentNode.insertBefore(div, elem.nextSibling);
  }, 0);

  return elem;
};
