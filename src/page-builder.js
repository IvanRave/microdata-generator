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
  'targetEntity',
  'targetSchema',
  'targetStyle',

  'formEntity',
  'formSchema',
  'formStyle',

  'lang',
  'domain'
];

const calculateEntityUrl = function(entityUrlId) {
  const parts = entityUrlId.split('|');
  return parts[0] === 'index' ? '' : parts[0];
};

/**
 * @param {Object} opts Page entity (options)
 * @param {Object} opts.targetEntity mainEntityOfPage
 * @param {String} opts.targetSchema A schema for a mainEntityOfPage
 * @param {String} opts.targetStyle A css style for a mainEntityOfPage
 * @param {String} opts.formEntity Form entity (user interaction)
 * @param {String} opts.formSchema Schema
 * @param {String} opts.formStyle Style

 * @param {String} opts.lang Page lang | rootEntity.inLanguage
 * @param {String} opts.domain Site domain

 * @param {String} opts.ANALYTICS_GOOGLE Google counter
 * @param {String} opts.ANALYTICS_YANDEX Yandex counter
 * @returns A promise with resolved ready DOM
 */
module.exports = function(opts) {
  return new Promise(function(resolve) {
    requiredFields.forEach(function(f) {
      if (!opts[f]) {
        throw new Error('required_option: ' + f + ' for url: ' + opts.url);
      }
    });

    const targetEntity = opts.targetEntity;
    const formEntity = opts.formEntity;

    const lang = opts.lang;

    // URLID
    if (!targetEntity.url || (targetEntity.url === '')) {
      throw new Error('required_url_or_index');
    }

    const pageUrl = calculateEntityUrl(targetEntity.url);

    const isAnalytics = !!(opts.ANALYTICS_GOOGLE || opts.ANALYTICS_YANDEX);

    const dom = new jsdom.JSDOM(`<!doctype html>
<html amp lang="${lang}">
<head>
  <meta charset="utf-8">
  ${isAnalytics ? ampHelper.ANALYTICS_SCRIPT : ''}
  ${ampHelper.COMMON_SCRIPT}
  <title>${targetEntity.name || targetEntity.headline}</title>
  <link rel="canonical" href="${opts.domain}/${pageUrl}">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  ${formEntity ? ampHelper.FORM_SCRIPT : ''}
  ${ampHelper.COMMON_STYLE}
  <style amp-custom>${opts.targetStyle} ${opts.formStyle}</style>
</head>
<body>
  <div id="root"></div>
  <form id="form" action="${opts.formAction}" method="GET" target="_top">
  </form>
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
    meta.content = targetEntity.description
      .replace(/"/g, '')
      .replace(/\n/g, ' ');

    document.getElementsByTagName('head')[0].appendChild(meta);

    const targetContainer = document.getElementById('root');
    const formContainer = document.getElementsByTagName('form')[0];

    if (!formContainer) {
      throw new Error('required_one_form_per_page');
    }

    buildEntityElement(targetContainer,
                       ['root'], // levelPaths (empty for a root)
                       opts.targetSchema,
                       targetEntity,
                       true); // isMainEntityDisplayOnly

    buildEntityElement(formContainer,
                       ['form'],
                       opts.formSchema,
                       formEntity,
                       false);

    const submitInput = document.createElement('input');
    submitInput.type = 'submit'; // value = 'Submit' (default)
    formContainer.appendChild(submitInput);

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
