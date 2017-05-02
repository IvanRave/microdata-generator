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

const calculateMarkedName = function(propertyName, sameAsPropertyName) {
  if (sameAsPropertyName) {
    if (sameAsPropertyName === 'sameAs') {
      // e.g. 'fb sameAs', 'vk sameAs' - remove non-existing properties
      return 'sameAs';
    }

    // e.g. 'url contentUrl' for images
    return propertyName + ' ' + sameAsPropertyName;
  }

  return propertyName;
};

helper.markProperty = function(propertyElem, propertyName, sameAsPropertyName) {
  if (!propertyName) { throw new Error('required_propertyName'); }

  propertyElem.setAttribute('itemprop', calculateMarkedName(propertyName, sameAsPropertyName));
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
