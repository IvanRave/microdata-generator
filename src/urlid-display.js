'use strict';

module.exports = {
  build: function() {
    return document.createElement('a');
  },
  update: function(elem, value) {
    const urlid = value;

    if (!urlid) {
      throw new Error('required_url: ' + elem.id);
    }

    // TODO: add a main host (calculate by js)
    elem.href = '/' + urlid;
    elem.textContent = '/' + urlid;
  }
};
