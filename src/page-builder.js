/**
 * Generate default markup for an entire page
 *   using some entity as a root element
 */

const ampHelper = require('./amp-helper');
const jsdom = require('jsdom');

jsdom.defaultDocumentFeatures = {
  FetchExternalResources: [], // "script"
  ProcessExternalResources: false
};

const buildEntityElement = require('./entity-builder');

const requiredFields = [
  'mainEntity',
  'mainSchema',
  'mainStyle',
  'title',
  'description',
  'lang',
  'domain'
];

/**
 * @param {Object} opts Page entity (options)
 * @param {Object} opts.mainEntity mainEntityOfPage
 * @param {String} opts.mainSchema A schema for a mainEntityOfPage
 * @param {String} opts.mainStyle A css style for a mainEntityOfPage
 * @param {Boolean} opts.isMainEntityDisplayOnly True if no forms on a page
 * @param {String} opts.title Page title
 * @param {String} opts.description Page description
 * @param {String} opts.lang Page lang | rootEntity.inLanguage
 * @param {String} opts.domain Site domain
 * @param {String} opts.url Page canonical url (relative to a domain)
 * @param {String} opts.ANALYTICS_GOOGLE Google counter
 * @param {String} opts.ANALYTICS_YANDEX Yandex counter
 * @returns A promise with resolved ready DOM
 */
module.exports = function(opts) {
  return new Promise(function(resolve) {
    requiredFields.forEach(function(f) {
      if (!opts[f]) {
        throw new Error('required_option: ' + f);
      }
    });

    if (!opts.url && (opts.url !== '')) {
      throw new Error('required_url_or_empty_string');
    }

    const isAnalytics = !!(opts.ANALYTICS_GOOGLE || opts.ANALYTICS_YANDEX);

    const dom = new jsdom.JSDOM(`<!doctype html>
<html amp lang="${opts.lang}">
<head>
<meta charset="utf-8">
${isAnalytics ? ampHelper.ANALYTICS_SCRIPT : ''}
${ampHelper.COMMON_SCRIPT}
<title>${opts.title}</title>
<link rel="canonical" href="${opts.domain}/${opts.url}" />
<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
${ampHelper.COMMON_STYLE}
<style amp-custom>${opts.mainStyle}</style>
</head>
<body>
<div id="root"></div>
${opts.ANALYTICS_GOOGLE ? ampHelper.buildAnalyticsElement('googleanalytics', {
  vars: {
    account: opts.ANALYTICS_GOOGLE
  },
  triggers: {
    track_pageview: {
      on: 'visible',
      request: 'pageview'
    }
  }
}) : ''}
${opts.ANALYTICS_YANDEX ? ampHelper.buildAnalyticsElement('metrika', {
  vars: {
    counterId: opts.ANALYTICS_YANDEX
  },
  triggers: {
    track_pageview: {
      on: 'visible',
      request: 'pageview'
    }
  }
}) : ''}
</body>
</html>`);

    global.document = dom.window.document;

    // <meta name="description" content="${rootEntity.description}">
    // a problem with some symbols. like '"'
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = opts.description
      .replace(/"/g, '')
      .replace(/\n/g, ' ');

    document.getElementsByTagName('head')[0].appendChild(meta);

    const wrapContainer = document.getElementById('root');

    buildEntityElement(wrapContainer,
                       [], // levelPaths (empty for a root)
                       opts.mainSchema,
                       opts.mainEntity,
                       opts.isMainEntityDisplayOnly);

    // TODO: change to amp-img elements right in generator
    ampHelper.convertImages(document);

    setTimeout(function() {
      // TODO: add css before </head> here (to skip CSS serialization)
      // use dom.serialize() to generate markup
      resolve(dom);
    }, 0);
  });
};

// TODO: html5 markup for elements, like h1, h2, section, etc
// const headerElem = document.getElementById('root__name_content') ||
//   document.getElementById('root__headline_content');
// if (!headerElem) { throw new Error('no_header'); }
// ampHelper.replaceTagName(document, headerElem, 'h1');
