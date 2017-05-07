'use strict';

const SCHEMA_ORG = 'http://schema.org/';

const helper = {
  // constants
  ENTITY: 'Item',
  ENTITY_LIST: 'ItemList'
};

// Instances of OfferCatalog may appear as values for the following properties
const LIST_VARIANTS = {
  'hasOfferCatalog': 'OfferCatalog',
  'breadcrumb': 'BreadcrumbList'
  // '*': 'ItemList'
};

const ALL_LIST_TYPES = Object.keys(LIST_VARIANTS).map(function(key) {
  return LIST_VARIANTS[key];
}).concat(helper.ENTITY_LIST);

helper.isElementList = function(elem) {
  const itemtype = elem.getAttribute('itemtype');

  if (!itemtype) {
    return false;
  }

  return ALL_LIST_TYPES.indexOf(itemtype.replace(SCHEMA_ORG, '')) >= 0;
};

helper.markEntity = function(entityElem, schemaName) {
  entityElem.setAttribute('itemscope', '');
  entityElem.setAttribute('itemtype', SCHEMA_ORG + schemaName);
};

helper.markEntityList = function(elem, propertyName) {
  elem.setAttribute('itemscope', '');

  const schemaNameForList = LIST_VARIANTS[propertyName] || helper.ENTITY_LIST;

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

  // Microdata validators do not like empty values
  // - simple elems, like spans
  // - meta with no content ('' or undefined)
  // - images with src ('' or undefined)
  if (propertyElem.innerHTML === '' &&
      !propertyElem.getAttribute('content') &&
      !propertyElem.src &&
      !helper.isElementList(propertyElem)) {
    propertyElem.removeAttribute('itemprop');
  } else {
    propertyElem.setAttribute('itemprop', calculateMarkedName(propertyName, sameAsPropertyName));
  }
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
