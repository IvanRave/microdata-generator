'use strict';

const makeId = function(pathLevels) {
  return pathLevels.join('__');
};

const makeContentId = function(pathLevels) {
  return makeId(pathLevels) + '_content';
};

const makeLabelId = function(pathLevels) {
  return makeId(pathLevels) + '_label';
};

module.exports = {
  makeId: makeId,
  makeContentId: makeContentId,
  makeLabelId: makeLabelId
};
