/**
 * Contains a list of simple inputs, according entity properties
 * @module
 */

'use strict';

const propFactory = require('./prop-factory');
const microdata = require('./microdata-marker');
const microdataTypes = require('microdata-types');
const propRow = require('./prop-row');
const idMarker = require('./id-marker');

const entityListWrapper = require('./entity-list-wrapper');

const PRIMARY_KEY = 'url';

/**
 * @param {String[]} entityPathLevels root.student.teacher.name or root.dateVisa
 */
const destroyEntityElem = function(elemRow,
                                   entityPathLevels) {
  const elemEntityId = idMarker.makeContentId(entityPathLevels);

  const elemEntity = elemRow.querySelector('#' + elemEntityId);

  if (elemEntity) {
    elemRow.removeChild(elemEntity);
  }
};

/**
 * Update a DOM element with current state of an entity.
 * @param {Object} elemRow A DOM element (container) for an entity
 * @param {String[]} entityPathLevels Base levels for an entity
 *        eg: second membership in a group: [group, memberships, 2]
 *        no path levels for a root element only.
 * @param {String} entitySchema Schema.org itemtype, like 'Person'
 * @param {Object} entity An object in computed-state format
 *        https://github.com/ivanRave/computed-state
 *        like 'student', 'person', 'thing', 'membership'
 * @param {Boolean} isEntityDisplayOnly Read mode (no write mode)
 * @returns {Object} Fulfilled DOM element for this entity
 */
const buildEntityElem = function(elemRow,
                                 entityPathLevels, // ['root', ...]
                                 entitySchema,
                                 entity,
                                 isEntityDisplayOnly) {
  const elemEntityId = idMarker.makeContentId(entityPathLevels);

  // entityId can be a plain text or Number
  // but can not be URL with slashes: /projects/123
  let elemEntity = elemRow.querySelector('#' + elemEntityId);

  if (!entity) {
    throw new Error('required_entity');
  }

  if (!elemEntity) {
    // Create an element with entity properties
    // Append to a parent element
    elemEntity = document.createElement('div');
    elemEntity.id = elemEntityId;
    // if (entityPathLevels.length > 0) {
    //   // TODO: propName mark prop
    // }
    microdata.markEntity(elemEntity, entitySchema, isEntityDisplayOnly);
    elemRow.appendChild(elemEntity);
    // } else {
    //   // TODO: update all inner properties
    //   throw new Error('not_realized_update');
  }

  // console.log('elemEntityContent', elemEntityContent);
  // update or create
  buildElementsFromSettings(elemEntity, entityPathLevels, entity, isEntityDisplayOnly); // eslint-disable-line

  return elemEntity;
};

const createElemInsertId = function(idPropType, typeChecker, pathLevels) {
  const elemInsertId = propFactory.createInput(idPropType, typeChecker);
  elemInsertId.setAttribute('data-entity-list-path',
                            pathLevels.join('.'));
  elemInsertId.setAttribute('data-action', 'insertItem');
  return elemInsertId;
};

const findOrCreateElemSection = function(elemRow,
                                         elemSectionId,
                                         entitySettings,
                                         pathLevels,
                                         isHashMap,
                                         isParentPropDisplayOnly) {
  const elemExisting = elemRow.querySelector('#' + elemSectionId);

  if (elemExisting) { return elemExisting; }

  // TODO: change to UL or something listable
  const elemCreated = document.createElement('div');
  elemCreated.id = elemSectionId;
  const propName = pathLevels[pathLevels.length - 1];
  if (!isHashMap) {
    microdata.markEntityList(elemCreated, propName, isParentPropDisplayOnly);
  }
  elemRow.appendChild(elemCreated);

  const idSetting = entitySettings[PRIMARY_KEY];
  if (!idSetting) {
    throw new Error('required_id: ' + PRIMARY_KEY + ' for ' + elemSectionId);
  }

  const idPropType = idSetting.type; // 'Country' | 'Integer'

  if (!isParentPropDisplayOnly) {
    const elemInsertId = createElemInsertId(idPropType, microdataTypes[idPropType], pathLevels);
    // TODO: or in ItemList element, like [].push
    elemRow.appendChild(elemInsertId);
  }

  // const elemInsert = document.createElement('button');
  // elemInsert.type = 'button';
  // elemInsert.setAttribute('data-action-type', 'insertItem');
  // elemInsert.setAttribute('data-entity-list-path', pathLevels.join('.'));

  return elemCreated;
};

/**
 * It doesnt depends of property name of a parent entity
 * @param {String[]} pathLevels Like ['root', 'university', 'students']
 *        Last String must be plural (collection of entities)
 * @param {String} entitySchema A schema for an item of this collection, like 'Person'
 * @param {Object} entitySettings A template for an item of this collection
 * @returns {Object} DOM element: list of items
 */
const buildEntityListElem = function(elemRow,
                                     pathLevels,
                                     parentPropName, // last of pathLevels
                                     entitySchema,
                                     entitySettings,
                                     entityList,
                                     isHashMap,
                                     isParentPropDisplayOnly) {
  if (pathLevels.length < 1) {
    throw new Error('required_path_levels_non_empty');
  }

  const elemSectionId = idMarker.makeContentId(pathLevels);

  const elemSection = findOrCreateElemSection(elemRow,
                                              elemSectionId,
                                              entitySettings,
                                              pathLevels,
                                              isHashMap,
                                              isParentPropDisplayOnly);

  entityListWrapper.updateItems(elemSection,
                                entityList,
                                entitySchema,
                                pathLevels,
                                parentPropName,
                                isParentPropDisplayOnly,
                                buildEntityElem,
                                isHashMap,
                                PRIMARY_KEY);

  return elemSection;
  // Update inner list

  // TODO
  // const itemInsertElem = buildItemInsertElem(pathLevels);
  // sectionElem.appendChild(itemInsertElem);
};

/**
 * Build an element for a property.
 * Just an empty element without value: value can be changed dynamically.
 * Other attributes cannot be changed dynamically (min, max, etc.) -
 *   there are only entities and properties in our methodology.
 * Other attributes are constants (can be changed by view layer)
 */
const buildSimpleElem = function(elemRow,
                                 parentPathLevels,
                                 propName,
                                 propType,
                                 propValue,
                                 isDisplayOnly) {
  const allPathLevels = parentPathLevels.concat(propName);

  const propContentId = idMarker.makeContentId(allPathLevels);

  let elemProp = elemRow.querySelector('#' + propContentId);

  if (!elemProp) {
    const typeChecker = microdataTypes[propType];

    // a property is created, then - filled with data
    if (isDisplayOnly) {
      elemProp = propFactory.createDisplay(propType, typeChecker);
    } else {
      elemProp = propFactory.createInput(propType, typeChecker);
      // 'root.some.prop'
      elemProp.setAttribute('data-entity-path', parentPathLevels.join('.'));
    }

    elemProp.id = propContentId;
    elemRow.appendChild(elemProp);
  }

  if (isDisplayOnly) {
    propFactory.setDisplayValue(elemProp, propValue);
  } else {
    propFactory.setInputValue(elemProp, propValue);
  }

  return elemProp;
};

const buildAnyElem = function(elemRow,
                              propName,
                              propSetting,
                              parentPathLevels,
                              propValue,
                              isPropDisplayOnly) {
  if (!propName || !propSetting) {
    throw new Error('required_propName_propSetting');
  }

  if (!elemRow) {
    throw new Error('required_elem_row');
  }

  const propType = propSetting.type;

  if (!propType) {
    throw new Error('required_propType');
  }

  const childEntitySettings = propSetting.refSettings;
  // ItemList as a HashMap
  const isHashMap = propSetting.isHashMap;
  // TODO: schema from inner entity
  const childEntitySchema = propSetting.schema;

  const pathLevels = parentPathLevels.concat(propName);

  switch (propType) {
    case microdata.ENTITY:
      if (!childEntitySettings) {
        throw new Error('required_ref_for_Item');
      }
      if (!childEntitySchema) {
        throw new Error('required_schema_for_Item: ' + propName);
      }

      // In an entity has been removed - destroy an element
      if (!propValue) {
        // console.warn('create_null_props', propName);
        destroyEntityElem(elemRow, pathLevels);
        return null;
      }

      // propValue = entity
      return buildEntityElem(elemRow,
                             pathLevels,
                             childEntitySchema,
                             propValue,
                             isPropDisplayOnly);

      // only root element without propName
      // itemprop must be outside of scope
      // <div itemprop="student" itemscope itemtype="Person">
      // it's a logical error: inner components do not depend of outer
    case microdata.ENTITY_LIST:
      // if no propVaule (entity) - use this settings to build
      //   the insertion form
      if (!childEntitySettings) {
        throw new Error('required_ref_for_ItemList');
      }
      if (!childEntitySchema) {
        throw new Error('required_schema_for_ItemList: ' + propName);
      }

      // propValue = [{ firstName: 'Jane' }]
      // propValue can be null (for non-existing entities)
      return buildEntityListElem(elemRow,
                                 pathLevels,
                                 propName,
                                 childEntitySchema,
                                 childEntitySettings,
                                 propValue || [],
                                 isHashMap,
                                 isPropDisplayOnly); // TODO: null array
    default:
      return buildSimpleElem(elemRow,
                             parentPathLevels,
                             propName,
                             propType,
                             propValue,
                             isPropDisplayOnly);
  }
};

// TODO: async objects
// 'firstName', ['student', 'person'], false, 'Text', 'Jane'
// 'created', ['memberships', 123], false, 'Date', '2010-01-01'

/**
 * @param {Object} entityTemplate Like {firtsName: {type: 'Text'}}
 * @param {String[]} parentPathLevels Like ['root', 'person', 'memberships']
 * @param {Object} entity Like { firtsName: 'Jane' }
 * @returns {Object[]} List of DOM elements
 */
const buildElementsFromSettings = function(elemEntity, parentPathLevels, entity, isEntityDisplayOnly) {
  if (!entity || !elemEntity) {
    // entityElement can not exist without an entity
    throw new Error('entity_and_elemEntity_must_exist');
  }

  const entitySettings = entity.__settings;

  if (!entitySettings) {
    console.log('entity', entity);
    throw new Error('no_entity__settings');
  }

  Object.keys(entitySettings).forEach(function(propName) {
    // student['name']
    const propSetting = entitySettings[propName];
    const propValue = entity[propName];

    if (propValue === undefined) {
      throw new Error('prop_can_not_be_undefined');
    }

    const isPropDisplayOnly = isEntityDisplayOnly ||
      !!propSetting.calculate ||
      parentPathLevels.indexOf('data') >= 0 ||
      propName === 'loading' ||
      propName === 'error';

    const allPathLevels = parentPathLevels.concat(propName);

    const propGlobalId = idMarker.makeId(allPathLevels);

    let elemRow = elemEntity.querySelector('#' + propGlobalId);

    if (!elemRow) {
      // If no property - create a wrap + content field
      // add it to the parent block
      // and update inner value
      elemRow = propRow(propGlobalId);
      elemRow.setAttribute('data-prop-row', propName);

      // Add to parent entity TODO: update
      elemEntity.appendChild(elemRow);
      // } else {
      //   throw new Error('not_realized_update_prop');
    }

    // create or update
    const anyElem = buildAnyElem(elemRow, propName, propSetting, parentPathLevels, propValue, isPropDisplayOnly);

    if (anyElem) {
      if (propSetting.isHashMap !== true) {
        microdata.markProperty(anyElem, propName, propSetting.sameAsProperty, isPropDisplayOnly, parentPathLevels);
      }
    }
  });
};

// props.parentPathLevels,
// props.entitySettings,
// props.entitySchema,
// props.entity
module.exports = buildEntityElem;
