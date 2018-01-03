/** @module */

'use strict';

module.exports = function() {
  const elem = document.createElement('input');
  elem.type = 'month';
  // elem.placeholder = 'dd.mm.yyyy';
  // TODO: manual input later
  // https://github.com/dbushell/Pikaday/issues/520
  // elem.readOnly = true;
  // TODO: load min and max from other DOM elements
  //    console.log('picker is created');
  // };

  return elem;
};
