'use strict';

// const microdata = require('./helpers/microdata');
const SEPAR = '__';

const microdata = require('./microdata-marker');

const calculateEntityId = function(entityUrlId) {
  if (!entityUrlId) {
    throw new Error('required_entityUrlId');
  }
  // URLID type
  const entityIdParts = entityUrlId.split('|');
  return entityIdParts[1] || entityIdParts[0];
};

module.exports = {
  updateItems: function(elemSection,
                        entityList,
                        entitySchema,
                        pathLevels,
                        parentPropName,
                        isGlobalDisplayOnly,
                        buildEntityElem,
                        isHashMap,
                        PRIMARY_KEY) {
    if (!elemSection) {
      throw new Error('required_elemSection');
    }

    // must be array
    if (!entityList || Array.isArray(entityList) === false) {
      throw new Error('required_entityList_array');
    }

    const allPathLevels = ['root'].concat(pathLevels);

    const ids = entityList.map(function(entity) {
      const entityUrlId = entity[PRIMARY_KEY];
      if (!entityUrlId) {
        throw new Error('required_urlid: ' + pathLevels.join('.'));
      }
      return allPathLevels.concat(calculateEntityId(entityUrlId)).join(SEPAR) + '_content';
    });

    const currentElems = elemSection.children;

    // delete excessive
    for (let i = currentElems.length - 1; i >= 0; i -= 1) {
      const needElem = currentElems[i];

      if (ids.indexOf(needElem.id) < 0) {
        elemSection.removeChild(needElem);
      }
    }

    // update or insert
    // TODO: index -> position
    entityList.forEach(function(entity) {
      if (!entity) {
        throw new Error('required_entity');
      }

      const entityId = calculateEntityId(entity[PRIMARY_KEY]);
      const entityPathLevels = pathLevels.concat(entityId);

      const elemEntity = buildEntityElem(elemSection,
                                         entityPathLevels,
                                         entitySchema,
                                         entity,
                                         isGlobalDisplayOnly);

      if (isHashMap) {
        // offers: [{}, {}]
        microdata.markProperty(elemEntity, parentPropName);
      } else {
        microdata.markPropertyAsListItem(elemEntity); // , index + 1
      }

      if (isGlobalDisplayOnly) { return; }

      const btn = elemEntity.querySelector('[data-action="removeItem"][data-entity-list-path="' + pathLevels.join('.') + '"]');

      if (btn) { return; }

      // TODO: if not exists
      const buttonRemoveItem = document.createElement('button');
      buttonRemoveItem.textContent = 'X';
      buttonRemoveItem.type = 'button';
      buttonRemoveItem.setAttribute('data-action', 'removeItem');
      const oidObject = {};
      oidObject[PRIMARY_KEY] = calculateEntityId(entity[PRIMARY_KEY]);

      buttonRemoveItem.setAttribute('data-entity-oid', JSON.stringify(oidObject));
      buttonRemoveItem.setAttribute('data-entity-list-path', pathLevels.join('.'));
      elemEntity.appendChild(buttonRemoveItem);
    });
  }
};
