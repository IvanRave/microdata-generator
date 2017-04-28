'use strict';

const SCHEMA_ORG = 'http://schema.org/';

const helper = {
  // constants
  ENTITY: 'Item',
  ENTITY_LIST: 'ItemList'
};

helper.markEntity = function(entityElem, schemaName) {
  entityElem.setAttribute('itemscope', '');
  entityElem.setAttribute('itemtype', SCHEMA_ORG + schemaName);
};

helper.markEntityList = function(elem, propName) {
  elem.setAttribute('itemscope', '');
  // http://schema.org/OfferCatalog inherits ItemList
  //  for hasOfferCatalog only
  const schemaNameForList = propName === 'hasOfferCatalog' ? 'OfferCatalog' : helper.ENTITY_LIST;
  elem.setAttribute('itemtype', SCHEMA_ORG + schemaNameForList);
};

helper.markProperty = function(propertyElem, propertyName, sameAsPropertyName) {
  // like 'url contentUrl' for images
  const val = propertyName +
        (sameAsPropertyName ? (' ' + sameAsPropertyName) : '');

  propertyElem.setAttribute('itemprop', val);
};

// https://schema.org/ItemList
helper.markPropertyAsListItem = function(elem) {
  helper.markProperty(elem, 'itemListElement');

  // // if 'position' not exists - insert it
  // const existingElem = elem.querySelector('[itemprop=position]');

  // if (existingElem) {
  //   // just change the position (if the list order is changed)
  //   existingElem.content = position;
  //   return;
  // }

  // const positionElem = document.createElement('meta');
  // positionElem.setAttribute('itemprop', 'position');
  // positionElem.content = position;
  // elem.appendChild(positionElem);
};

module.exports = helper;
