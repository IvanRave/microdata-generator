'use strict';

module.exports = {
  build: function() {
    const a = document.createElement('a');
    // all external links: not always good decision
    // all internal links uses URLID element
    a.rel = 'nofollow';
    return a;
  },
  update: function(elem, value) {
    const url = value;

    // elem.innerHTML = '';

    if (url) {
      const urlText = url.replace(/^http:\/\//g, '')
            .replace(/^https:\/\//g, '')
            .replace(/\/$/g, '');

      // const a = document.createElement('a');
      elem.href = url;
      elem.textContent = urlText;
      // elem.setAttribute('content', url);
      // TODO: yandex required only href
      // AMP: The attribute 'href' may not appear in tag 'span'.
      // elem.setAttribute('href', url);
      // elem.appendChild(a);
    } else {
      // elem.removeAttribute('content');
      elem.removeAttribute('href');
      elem.textContent = '';
      // console.warn('no_url: ' + elem.id);
    }
  }
};
