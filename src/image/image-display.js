/**
 * Image
 * ImageObject: { id: url, width: 100, height: 200, alt: 'asdf' }
 */

'use strict';

const parseImageMeta = function(imageMeta) {
  const parts = imageMeta.split('|');

  if (!parts[0]) {
    throw new Error('required_imageMeta_src');
  }

  const result = {
    src: parts[0]
  };

  for (let i = 1; i < parts.length; i += 1) {
    const keyValue = parts[i].split('=');
    result[keyValue[0]] = keyValue[1];
  }

  return result;
};

module.exports = {
  build: function() {
    return document.createElement('img');
  },
  update: function(elem, value) {
    if (value === null) {
      throw new Error('image can not be null at this moment');
    }

    const imageMeta = parseImageMeta(value);

    elem.src = imageMeta.src;
    if (imageMeta.width) { elem.width = imageMeta.width; }
    if (imageMeta.height) { elem.height = imageMeta.height; }
    if (imageMeta.alt) { elem.alt = imageMeta.alt; }
  }
};
