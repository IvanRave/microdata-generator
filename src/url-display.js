'use strict';

module.exports = {
  build: function() {
    return document.createElement('span');
  },
  update: function(elem, value) {
    const url = value;

    elem.innerHTML = '';

    if (url) {
      const urlText = url.replace(/^http:\/\//g, '')
            .replace(/^https:\/\//g, '')
            .replace(/\/$/g, '');

      const a = document.createElement('a');
      a.href = url;
      a.textContent = urlText;
      elem.setAttribute('content', url);
      // TODO: yandex required only href
      // AMP: The attribute 'href' may not appear in tag 'span'.
      // elem.setAttribute('href', url);
      elem.appendChild(a);
    } else {
      elem.removeAttribute('content');
      // elem.removeAttribute('href');
      // console.warn('no_url: ' + elem.id);
    }
  }
};
