/**
 * Telephone number
 * LocalBusiness.telephone
 * optional property
 * If telephone = null:
 * - input: empty field
 * - display:
 *   - remove the element
 *   - write: 'no phone' (throug view layer: css 'content') - it is better, if a user knows, that's no phone number
 * ```<span itemprop="telephone"></span>```
 * https://tools.ietf.org/html/rfc3966#section-6
 * <a href="tel:+1-555-438-3732">1-555-IETF-RFC</a>.
 *
 * Bad value tel:+7 xxx xx-xxx-xx for attribute href on element a: Illegal character in scheme data: space is not allowed.
 */

'use strict';

module.exports = {
  build: function() {
    return document.createElement('span');
  },
  update: function(elem, value) {
    elem.innerHTML = '';
    if (!value) {
      console.log('optional_telephone: ' + elem.id);
      return;
    }

    const a = document.createElement('a');
    a.href = 'tel:' + value.replace(/\s/g, '');
    a.textContent = value;
    elem.appendChild(a);
  }
};
