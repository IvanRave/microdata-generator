/** String input */

'use strict';

module.exports = function() {
  const elem = document.createElement('input');
  elem.type = 'text';
  elem.placeholder = 'duration';
  // TODO: show picker like date: years, months, days number

  return elem;
};
