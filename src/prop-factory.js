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

 * Set property value: input or display
 * A component builded in a factory
 *
 * 1.
 * Ideally a component must have an Update method, like
 *   - elem.value = 123      (for number-display)
 *   - elem.checked = true   (for boolean-display)
 *   - elem.href = 'http...' (for url-display)
 * but all components must have the same interface (factory method)
 * It is a bad practice to extend DOM elements:
 * https://stackoverflow.com/a/4670470/1197421
 *
 * 2.
 * Creating wrapper objects around DOM nodes
 *   as jQuery, YUI and other libraries do.
 * But it means that you need to use very specific $.get methods
 *   through a whole project: it is difficult to change a library
 *
 * 3.
 * Use a factory to create a new state of the object
 *
 * @module
 */

'use strict';

// at this moment it's not a class
// will be converted when custom elements will be released
// browserify doesnt support dynamic requires
const BooleanDisplay = require('./boolean/boolean-display');
const TextDisplay = require('./text/text-display');
const MultitextDisplay = require('./multitext/multitext-display');
const CodeDisplay = require('./code/code-display');
const TelephoneDisplay = require('./telephone/telephone-display');
const EmailDisplay = require('./email/email-display');
const NumberDisplay = require('./number/number-display');
const DateDisplay = require('./date/date-display');
const UrlDisplay = require('./url/url-display');
const UrlIdDisplay = require('./urlid/urlid-display');
const ImageDisplay = require('./image/image-display');

const BooleanInput = require('./boolean/boolean-input');
const TextInput = require('./text/text-input');
const NumberInput = require('./number/number-input');
const AgeInput = require('./age/age-input');
const DecadeInput = require('./decade/decade-input');
const DateInput = require('./date/date-input');
const DurationInput = require('./duration/duration-input');
const CountryInput = require('./country/country-input');

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

const reselectOptions = function(elem, value) {
  const options = elem.children;
  for (let i = options.length - 1; i >= 0; i -= 1) {
    const needOption = options[i];
    // setAttribute for static html
    if (needOption.value === value) {
      needOption.setAttribute('selected', 'selected');
    } else {
      needOption.removeAttribute('selected');
    }
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
  /**
   * Input.value setter
   * Convert source type to input type (text, checkbox, date)
   * value - for inputs
   * textContent - for readable properties
   * Polyfill for elem.setTypedValue
   */
  setInputValue: function(elemInput, value) {
    // no-param-reassign
    const elem = elemInput;

    if (value === undefined) {
      throw new Error('value_can_not_be_undefined');
    }

    switch (elem.type) {
      case 'checkbox':
        elem.checked = value; // null or false or true
        if (value === true) {
          elem.setAttribute('checked', 'checked');
          // default value in some browsers
          elem.setAttribute('value', 'on');
        } else {
          elem.removeAttribute('checked');
          elem.removeAttribute('value');
        }
        break;
      case 'select-one':
        // Attribute value not allowed on element select at this point
        elem.value = value === null ? '' : value;
        reselectOptions(elem, value);
        break;
      default:
        elem.value = value === null ? '' : value;
        if (value !== null) {
          elem.setAttribute('value', value);
        } else {
          elem.removeAttribute('value');
        }
    }
  },
  createDisplay: function(propType, typeChecker) {
    const elemClass = calculateDisplay(propType).build;

    const elem = elemClass(typeChecker);

    elem.setAttribute('data-schema-type', propType);

    const tag = propType.toLowerCase() + '-display';
    // use classes instead tags, while no custom elements
    elem.className = tag;
    return elem;
  },
  setDisplayValue: function(elemDisplay, value) {
    const elem = elemDisplay;

    if (value === undefined) {
      throw new Error('value_can_not_be_undefined');
    }

    const schemaType = elem.getAttribute('data-schema-type');

    if (!schemaType) {
      throw new Error('required_data-schema-type');
    }

    const handler = calculateDisplay(schemaType);

    handler.update(elem, value);
  }
};
