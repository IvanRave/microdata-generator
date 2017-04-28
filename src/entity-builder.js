/**
 * Contains a list of simple inputs, according entity properties
 * @module
 */

'use strict';

const propFactory = require('./prop-factory');
const propSetter = require('./prop-setter');
const microdata = require('./helpers/microdata');
const microdataTypes = require('microdata-types');
const propRow = require('./prop-row');

const entityListWrapper = require('./entity-list-wrapper');

const SEPAR = '__';

const PRIMARY_KEY = 'url';

const buildInputName = function(parentPathLevels, propName) {
  const levels = parentPathLevels.concat(propName);

  let str = levels[0];

  for (let i = 1; i < levels.length; i += 1) {
    str += '[' + levels[i] + ']';
  }

  return str;
};

const destroyEntityElem = function(elemRow,
                                   entityPathLevels) {
  const allPathLevels = ['root'].concat(entityPathLevels);

  const elemEntityId = allPathLevels.join(SEPAR) + '_content';

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
 * @param {Boolean} isGlobalDisplayOnly Read mode (no write mode)
 * @returns {Object} Fulfilled DOM element for this entity
 */
const buildEntityElem = function(elemRow,
                                 entityPathLevels,
                                 entitySchema,
                                 entity,
                                 isGlobalDisplayOnly) {
  const allPathLevels = ['root'].concat(entityPathLevels);

  const elemEntityId = allPathLevels.join(SEPAR) + '_content';

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
    //   // TODO: propName
    //   microdata.markProperty(elemEntityContent, propName);
    // }
    microdata.markEntity(elemEntity, entitySchema);
    elemRow.appendChild(elemEntity);
    // } else {
    //   // TODO: update all inner properties
    //   throw new Error('not_realized_update');
  }

  // console.log('elemEntityContent', elemEntityContent);
  // update or create
  buildElementsFromSettings(elemEntity, entityPathLevels, entity, isGlobalDisplayOnly); // eslint-disable-line

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
                                         isGlobalDisplayOnly) {
  const elemExisting = elemRow.querySelector('#' + elemSectionId);

  if (elemExisting) { return elemExisting; }

  // TODO: change to UL or something listable
  const elemCreated = document.createElement('div');
  elemCreated.id = elemSectionId;
  const propName = pathLevels[pathLevels.length - 1];
  microdata.markEntityList(elemCreated, propName);
  elemRow.appendChild(elemCreated);

  const idSetting = entitySettings[PRIMARY_KEY];
  if (!idSetting) {
    throw new Error('required_id: ' + PRIMARY_KEY + ' for ' + elemSectionId);
  }

  const idPropType = idSetting.type; // 'Country' | 'Integer'

  if (!isGlobalDisplayOnly) {
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
 * @param {String[]} pathLevels Like ['university', 'students']
 *        Last String must be plural (collection of entities)
 * @param {Object} entitySettings A template for an item of this collection
 * @param {String} entitySchema A schema for an item of this collection, like 'Person'
 * @returns {Object} DOM element: list of items
 */
const buildEntityListElem = function(elemRow,
                                     pathLevels,
                                     entitySchema,
                                     entitySettings,
                                     entityList,
                                     isGlobalDisplayOnly) {
  if (pathLevels.length < 1) {
    throw new Error('required_path_levels_non_empty');
  }

  const allPathLevels = ['root'].concat(pathLevels);

  const elemSectionId = allPathLevels.join(SEPAR) + '_content';

  const elemSection = findOrCreateElemSection(elemRow,
                                              elemSectionId,
                                              entitySettings,
                                              pathLevels,
                                              isGlobalDisplayOnly);

  entityListWrapper.updateItems(elemSection,
                                entityList,
                                entitySchema,
                                pathLevels,
                                isGlobalDisplayOnly,
                                buildEntityElem,
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
  const allPathLevels = ['root'].concat(parentPathLevels.concat(propName));

  const propContentId = allPathLevels.join(SEPAR) + '_content';

  let elemProp = elemRow.querySelector('#' + propContentId);

  if (!elemProp) {
    const typeChecker = microdataTypes[propType];

    // a property is created, then - filled with data
    if (isDisplayOnly) {
      elemProp = propFactory.createDisplay(propType, typeChecker);
    } else {
      elemProp = propFactory.createInput(propType, typeChecker);
      elemProp.name = buildInputName(parentPathLevels, propName);
      elemProp.setAttribute('data-entity-path', parentPathLevels.join('.') || 'root');
    }

    elemProp.id = propContentId;
    elemRow.appendChild(elemProp);
  }

  if (isDisplayOnly) {
    propSetter.setDisplayValue(elemProp, propValue);
  } else {
    propSetter.setInputValue(elemProp, propValue);
  }

  return elemProp;
};

const buildAnyElem = function(elemRow, propName, propSetting, parentPathLevels, propValue, isPropDisplayOnly) {
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
                                 childEntitySchema,
                                 childEntitySettings,
                                 propValue || [],
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
 * @param {String[]} parentPathLevels Like ['person', 'memberships']
 * @param {Object} entity Like { firtsName: 'Jane' }
 * @returns {Object[]} List of DOM elements
 */
const buildElementsFromSettings = function(elemEntity, parentPathLevels, entity, isGlobalDisplayOnly) {
  if (!entity || !elemEntity) {
    // entityElement can not exist without an entity
    throw new Error('entity_and_elemEntity_must_exist');
  }

  const entitySettings = entity.__settings;

  Object.keys(entitySettings).forEach(function(propName) {
    // student['name']
    const propSetting = entitySettings[propName];
    const propValue = entity[propName];

    if (propValue === undefined) {
      throw new Error('prop_can_not_be_undefined');
    }

    const propLabel = propSetting.label;
    if (!propLabel) {
      throw new Error('required_label: ' + propName);
    }

    const isPropDisplayOnly = isGlobalDisplayOnly ||
      !!propSetting.calculate ||
      parentPathLevels.indexOf('data') >= 0 ||
      propName === 'loading' ||
      propName === 'error';

    // TODO: root__
    const allPathLevels = ['root'].concat(parentPathLevels.concat(propName));

    const propGlobalId = allPathLevels.join(SEPAR);

    let elemRow = elemEntity.querySelector('#' + propGlobalId);

    if (!elemRow) {
      // If no property - create a wrap + label + content
      // add it to the parent block
      // and update inner value
      elemRow = propRow(propGlobalId);
      elemRow.setAttribute('data-prop-row', propName);

      const elemLabel = document.createElement('label');
      elemLabel.id = propGlobalId + '_label';
      // if writable property, like <input>
      if (!isPropDisplayOnly) {
        elemLabel.htmlFor = propGlobalId + '_content';
      }

      elemLabel.textContent = propLabel;
      elemRow.appendChild(elemLabel); // <td>label</td>

      // Add to parent entity TODO: update
      elemEntity.appendChild(elemRow);
      // } else {
      //   throw new Error('not_realized_update_prop');
    }

    const anyElem = buildAnyElem(elemRow, propName, propSetting, parentPathLevels, propValue, isPropDisplayOnly);

    if (anyElem) {
      microdata.markProperty(anyElem, propName, propSetting.sameAsProperty);
    }
  });
};

// props.parentPathLevels,
// props.entitySettings,
// props.entitySchema,
// props.entity
module.exports = buildEntityElem;
