/** @module */

'use strict';

// TODO: use moment.js
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

module.exports = function () {
  const elem = document.createElement('select');

  const emptyOption = document.createElement('option');
  emptyOption.textContent = '';
  emptyOption.value = '';
  elem.appendChild(emptyOption);

  monthNames.forEach(function (monthName, idx) {
    const elemOption = document.createElement('option');
    elemOption.value = idx;
    elemOption.textContent = monthName;
    elemOption.label = monthName;
    elem.appendChild(elemOption);
  });

  return elem;
};
