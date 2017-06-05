'use strict';

const replaceTagName = function(doc, original, tagName) {
  // Create a replacement tag of the desired type
  const replacement = doc.createElement(tagName);

  // Grab all of the original's attributes, and pass them to the replacement
  for (let i = 0, l = original.attributes.length; i < l; i += 1) {
    const nodeName = original.attributes.item(i).nodeName;
    const nodeValue = original.attributes.item(i).nodeValue;

    replacement.setAttribute(nodeName, nodeValue);
  }

  // Persist contents
  replacement.innerHTML = original.innerHTML;

  // Switch!
  original.parentNode.replaceChild(replacement, original);

  return replacement;
};

module.exports = {
  replaceTagName: replaceTagName,
  convertImages: function(doc) {
    const imgElements = doc.getElementsByTagName('img');

    for (let imgIndex = 0, imgLength = imgElements.length; imgIndex < imgLength; imgIndex += 1) {
      const imgNew = replaceTagName(doc, imgElements[imgIndex], 'amp-img');
      imgNew.setAttribute('layout', 'responsive');

      // <div fallback>
      //     <p>Your browser doesn’t support HTML5 video.</p>
      //   </div>

      const fallback = doc.createElement('div');
      fallback.setAttribute('fallback', '');
      fallback.textContent = 'no photo';

      imgNew.appendChild(fallback);
    }
  },
  // https://www.ampproject.org/docs/tutorials/create/basic_markup
  COMMON_STYLE: '<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>',
  COMMON_SCRIPT: '<script async src="https://cdn.ampproject.org/v0.js"></script>',
  ANALYTICS_SCRIPT: '<script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>',
  /**
   * https://www.ampproject.org/docs/reference/components/amp-analytics
   * https://yandex.com/support/metrica/code/install-counter-amp.xml
   * ua UA-xxxxxx-x
   */
  buildAnalyticsElement: function(vendor, config) {
    return `<amp-analytics type="${vendor}"><script type="application/json">${JSON.stringify(config)}</script></amp-analytics>`;
  }
};
