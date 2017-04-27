/**
 * A property wrapper:
 * - an element with property name
 * - an element with property value
 */

'use strict';

module.exports = function(rowId) {
  const row = document.createElement('fieldset');
  row.id = rowId;
  row.className = 'prop-row';
  return row;
};
