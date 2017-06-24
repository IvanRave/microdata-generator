'use strict';

const microdata = require('./microdata-marker');
const idMarker = require('./id-marker');

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
                        isEntityDisplayOnly,
                        buildEntityElem,
                        isHashMap,
                        PRIMARY_KEY) {
    if (!elemSection) {
      throw new Error('required_elemSection');
    }

    if (isHashMap === true && isEntityDisplayOnly !== true) {
      throw new Error('required_isHashMap_equals_isEntityDisplayOnly_true');
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

      return idMarker.makeContentId(allPathLevels.concat(calculateEntityId(entityUrlId)));
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
                                         isEntityDisplayOnly);

      microdata.markPropertyAsListItem(elemEntity, parentPropName, isHashMap); // , index + 1

      if (isEntityDisplayOnly) { return; }

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
