'use strict';

const makeId = function(pathLevels) {
  return pathLevels.join('__');
};

const makeContentId = function(pathLevels) {
  return makeId(pathLevels) + '_content';
};

module.exports = {
  makeId: makeId,
  makeContentId: makeContentId
};
