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

    // index - defatul site page - default (root) entity ID
    const resultLink = '/' +  (urlid === 'index' ? '' : urlid);

    // TODO: add a main host (calculate by js)
    elem.href = resultLink;
    elem.textContent = resultLink;
  }
};
