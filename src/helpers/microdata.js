'use strict';

const helper = {
  // constants
  ENTITY: 'Item',
  ENTITY_LIST: 'ItemList'
};

helper.markEntity = function(entityElem, schemaName) {
  entityElem.setAttribute('itemscope', '');
  entityElem.setAttribute('itemtype', 'http://schema.org/' + schemaName);
};

helper.markEntityList = function(elem) {
  elem.setAttribute('itemscope', '');
  elem.setAttribute('itemtype', 'http://schema.org/ItemList');
};

helper.markProperty = function(propertyElem, propertyName, sameAsPropertyName) {
  // like 'url contentUrl' for images
  const val = propertyName +
        (sameAsPropertyName ? (' ' + sameAsPropertyName) : '');

  propertyElem.setAttribute('itemprop', val);
};

// https://schema.org/ItemList
helper.markPropertyAsListItem = function(elem, position) {
  helper.markProperty(elem, 'itemListElement');

  // if 'position' not exists - insert it
  const existingElem = elem.querySelector('[itemprop=position]');

  if (existingElem) {
    // just change the position (if the list order is changed)
    existingElem.content = position;
    return;
  }

  const positionElem = document.createElement('meta');
  positionElem.setAttribute('itemprop', 'position');
  positionElem.content = position;
  elem.appendChild(positionElem);
};

module.exports = helper;
