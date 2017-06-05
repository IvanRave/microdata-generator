/**
 * URI - Universal Resource Identifier
 * ID - Identifier in some domain (db table)
 *
 * URL:
 * - unique globally
 * - readable for users (and search engines)
 *
 * ID:
 * - unique per a table
 * - used as part of ID for DOM elements
 * - readable for developers, normalized for systems
 *
 * URL and ID must contain allowed characters only
 *   HTML4: ID and NAME tokens must begin with a letter ([A-Za-z]) and may be followed by any number of letters, digits ([0-9]), hyphens ("-"), underscores ("_"), colons (":"), and periods (".").
 *
 * URL = SiteDomain + Table + ID
 * or
 * Relative URL = Table + ID
 * - /service/Web development
 * - /book/Brave New World
 * - /book-chapter/Final Part of Brave New World (Qualified identifier)
 *   or /book/:bookName/chapter/:chapterName
 * - /city-service/Home cleaning in Moscow
 *   or /city/:cityName/service/:serviceName
 *
 * To construct any URLs URLID may contain two parameters:
 * - URL (readable non-id URL)
 * - ID
 *
 * It is just a hack to use any URLs
 *
 * It is better to make readable ids, like
 * - book/brave-new-world
 * - service/web-development
 * - city-service/home-cleaning-in-moscow
 * - service/web-razrabotka (translit from other languages)
 * and construct URLs, using schema: Table/ID
 */

'use strict';

module.exports = {
  build: function() {
    return document.createElement('a');
  },
  update: function(elem, value) {
    const urlid = value;

    if (!urlid) {
      throw new Error('required_url: ' + elem.id);
    }

    const url = urlid.split('|')[0]; // remove ID part

    // index - defatul site page - default (root) entity ID
    const resultLink = '/' + (url === 'index' ? '' : url);

    // TODO: add a main host (calculate by js)
    elem.href = resultLink;
    elem.textContent = decodeURI(resultLink);
  }
};
