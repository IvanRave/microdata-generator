'use strict';

// const microdata = require('./helpers/microdata');
const SEPAR = '__';

const microdata = require('./helpers/microdata');

module.exports = {
  updateItems: function(elemSection, entityList, entitySchema, pathLevels, typeCheckers, isGlobalDisplayOnly, buildEntityElem, PRIMARY_KEY) {
    if (!elemSection) {
      throw new Error('required_elemSection');
    }

    // must be array
    if (!entityList || Array.isArray(entityList) === false) {
      throw new Error('required_entityList_array');
    }

    const allPathLevels = ['root'].concat(pathLevels);

    const ids = entityList.map(function(entity) {
      return allPathLevels.concat(entity[PRIMARY_KEY]).join(SEPAR) + '_content';
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
    entityList.forEach(function(entity, index) {
      if (!entity) {
        throw new Error('required_entity');
      }

      const entityPathLevels = pathLevels.concat(entity[PRIMARY_KEY]);

      const elemEntity = buildEntityElem(elemSection,
                                         entityPathLevels,
                                         entitySchema,
                                         entity,
                                         typeCheckers,
                                         isGlobalDisplayOnly);

      microdata.markPropertyAsListItem(elemEntity, index + 1);

      if (isGlobalDisplayOnly) { return; }

      const btn = elemEntity.querySelector('[data-action="removeItem"][data-entity-list-path="' + pathLevels.join('.') + '"]');

      if (btn) { return; }

      // TODO: if not exists
      const buttonRemoveItem = document.createElement('button');
      buttonRemoveItem.textContent = 'X';
      buttonRemoveItem.type = 'button';
      buttonRemoveItem.setAttribute('data-action', 'removeItem');
      const oidObject = {};
      oidObject[PRIMARY_KEY] = entity[PRIMARY_KEY];

      buttonRemoveItem.setAttribute('data-entity-oid', JSON.stringify(oidObject));
      buttonRemoveItem.setAttribute('data-entity-list-path', pathLevels.join('.'));
      elemEntity.appendChild(buttonRemoveItem);
    });
  }
};
