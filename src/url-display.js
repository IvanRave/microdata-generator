'use strict';

// siteUrl=http://asdfasdf.asdf/123|superSite
// const parseUrlMeta = function(urlMeta) {
//   const parts = urlMeta.split('|');

//   if (!parts[0]) {
//     throw new Error('required_imageMeta_src');
//   }

//   const result = {
//     href: parts[0]
//   };

//   if (parts[1]) { result.textContent = parts[1]; }

//   return result;
// };

module.exports = {
  build: function() {
    return document.createElement('a');
  },
  update: function(elem, value) {
    const url = value;

    if (!url) {
      throw new Error('required_url: ' + elem.id);
    }

    const urlText = url.replace(/^http:\/\//g, '')
          .replace(/^https:\/\//g, '')
          .replace(/\/$/g, '');

    elem.href = url;
    elem.textContent = urlText;
  }
};
