/**
 * Mark elements as microdata entities
 * - property - itemprop
 * - list - itemlist
 * - listElement - itemListElement
 * Singleton + Decorator
 */

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

helper.markEntity = function(entityElem, schemaName, isEntityDisplayOnly) {
  // TODO: skip for forms
  if (!isEntityDisplayOnly) {
    console.log('warning_mark_entity_for_write_mode');
  }

  entityElem.setAttribute('itemscope', '');
  entityElem.setAttribute('itemtype', SCHEMA_ORG + schemaName);
};

helper.markEntityList = function(elem, propertyName, isEntityListDisplayOnly) {
  // TODO: skip for forms
  if (!isEntityListDisplayOnly) {
    console.log('warning_mark_entity_list_for_write_mode');
  }

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

const markDisplayProperty = function(propertyElem, propertyName, sameAsPropertyName) {
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

  return propertyElem;
};

const buildInputName = function(parentPathLevels, propertyName) {
  const levels = parentPathLevels.concat(propertyName);

  let str = levels[0];

  for (let i = 1; i < levels.length; i += 1) {
    str += '[' + levels[i] + ']';
  }

  return str;
};

/**
 * Every input element has the name attribute
 * - name must be unique per a form
 * - few entities can be in a form
 * Use concated name '[student][birthDate]'
 */
const markInputProperty = function(propertyElem, propertyName, parentPathLevels) {
  propertyElem.name = buildInputName(parentPathLevels, propertyName);
  return propertyElem;
};

/**
 * @param {Object} propertyElem DOM element
 * @param {String} propertyName Schema name for this property
 * @param {String} sameAsPropertyName Aternative name for this property
 * @returns {Object} The same DOM element with changes:
 *   - set 'itemprop' for suitable read-only elements
 *   - set 'name' for read-write form elements, like inputs
 *   - remove 'itemprop' for empty values (required for validators)
 */
helper.markProperty = function(propertyElem, propertyName, sameAsPropertyName, isPropDisplayOnly, parentPathLevels) {
  if (!propertyName) { throw new Error('required_propertyName'); }

  if (isPropDisplayOnly) {
    return markDisplayProperty(propertyElem, propertyName, sameAsPropertyName);
  } else {
    if (sameAsPropertyName) {
      throw new Error('input_prop_can_not_have_sameAs: ' + propertyName);
    }

    // TODO: remove
    markDisplayProperty(propertyElem, propertyName, sameAsPropertyName);
    return markInputProperty(propertyElem, propertyName, parentPathLevels);
  }
};

// https://schema.org/ItemList
helper.markPropertyAsListItem = function(elem, parentPropName, isHashMap) {
  if (isHashMap) {
    // schema.org hack: a List represents as a plain Scope of elements
    // offers: [{}, {}]
    markDisplayProperty(elem, parentPropName, null);
  } else {
    markDisplayProperty(elem, 'itemListElement', null);
    // helper.markProperty(elem, 'itemListElement');
  }

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
