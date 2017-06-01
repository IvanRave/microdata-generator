/**
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
 * Use helpers
 */

'use strict';

const DateDisplay = require('./date-display');
const UrlDisplay = require('./url-display');
const UrlIdDisplay = require('./urlid-display');
const TelephoneDisplay = require('./telephone-display');
const EmailDisplay = require('./email-display');
const ImageDisplay = require('./image-display');
const BooleanDisplay = require('./boolean-display');
const TextDisplay = require('./text-display');
const MultitextDisplay = require('./multitext-display');
const CodeDisplay = require('./code-display');
const NumberDisplay = require('./number-display');

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

/**
 * Input.value setter
 * Convert source type to input type (text, checkbox, date)
 * value - for inputs
 * textContent - for readable properties
 * Polyfill for elem.setTypedValue
 */
const setInputValue = function(elemInput, value) {
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
};

// the same as propFactory
const selectHandler = function(schemaType) {
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

const setDisplayValue = function(elemDisplay, value) {
  const elem = elemDisplay;

  if (value === undefined) {
    throw new Error('value_can_not_be_undefined');
  }

  const schemaType = elem.getAttribute('data-schema-type');

  if (!schemaType) {
    throw new Error('required_data-schema-type');
  }

  const handler = selectHandler(schemaType);

  handler.update(elem, value);
};

module.exports = {
  setInputValue: setInputValue,
  setDisplayValue: setDisplayValue
};
