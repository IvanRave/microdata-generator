/**
 * A component factory, like document.createElement
 *
 * Name convention for custom elements:
 * - two or more words
 * - separated by dash
 * - lowercase
 * - Latin characters
 *
 * Boolean-input can be a selector, radio, simple input, etc.
 * it depends of design of a project
 *
 * @todo switch to custom elements after release
 * @todo use <template> to clone instead building elems from scratch
 * @module
 */

'use strict';

// at this moment it's not a class
// will be converted when custom elements will be released
// browserify doesnt support dynamic requires
const BooleanDisplay = require('./boolean-display');
const TextDisplay = require('./text-display');
const MultitextDisplay = require('./multitext-display');
const CodeDisplay = require('./code-display');
const TelephoneDisplay = require('./telephone-display');
const EmailDisplay = require('./email-display');
const NumberDisplay = require('./number-display');
const DateDisplay = require('./date-display');
const UrlDisplay = require('./url-display');
const UrlIdDisplay = require('./urlid-display');
const ImageDisplay = require('./image-display');

const BooleanInput = require('./boolean-input');
const TextInput = require('./text-input');
const NumberInput = require('./number-input');
const AgeInput = require('./age-input');
const DecadeInput = require('./decade-input');
const DateInput = require('./date-input');
const DurationInput = require('./duration-input');
const CountryInput = require('./country-input');

const calculateInput = function(tag) {
  switch (tag) {
    case 'boolean-input':
      return BooleanInput;
    case 'text-input':
    case 'url-input':
    case 'urlid-input':
    case 'telephone-input':
    case 'email-input':
      return TextInput;
    case 'number-input':
    case 'integer-input':
    case 'float-input':
      return NumberInput;
    case 'age-input':
      return AgeInput;
    case 'decade-input':
      return DecadeInput;
    case 'date-input':
      return DateInput;
    case 'duration-input':
      return DurationInput;
    case 'country-input':
      return CountryInput;

    default:
      throw new Error('tag_is_not_supported: ' + tag);
  }
};

const calculateDisplay = function(schemaType) {
  switch (schemaType) {
    case 'URL':
      return UrlDisplay;
    case 'URLID':
      return UrlIdDisplay;
    case 'Telephone':
      return TelephoneDisplay;
    case 'Email':
      return EmailDisplay;
    case 'Image':
      return ImageDisplay;
    case 'Boolean':
      return BooleanDisplay;
    case 'Date':
      return DateDisplay;
    case 'Text':
      return TextDisplay;
    case 'Multitext':
      return MultitextDisplay;
    case 'Code':
      return CodeDisplay;
    case 'Number':
    case 'Integer':
    case 'Float':
    case 'Age':
      return NumberDisplay;
    default:
      throw new Error('propSetter: tag_is_not_supported: ' + schemaType);
  }
};

module.exports = {
  createInput: function(propType, typeChecker) {
    const tag = propType.toLowerCase() + '-input';

    // TODO: add 'build' to input controls
    const elemClass = calculateInput(tag);

    const elem = elemClass(typeChecker);

    elem.setAttribute('data-schema-type', propType);

    // use classes instead tags, while no custom elements
    elem.className = tag;
    return elem;
  },
  createDisplay: function(propType, typeChecker) {
    const elemClass = calculateDisplay(propType).build;

    const elem = elemClass(typeChecker);

    elem.setAttribute('data-schema-type', propType);

    const tag = propType.toLowerCase() + '-display';
    // use classes instead tags, while no custom elements
    elem.className = tag;
    return elem;
  }
};
