/**
 * Generate default markup for a page
 *   using some entity as a root element
 */

const ampHelper = require('./amp-helper');
const jsdom = require('jsdom');

jsdom.defaultDocumentFeatures = {
  FetchExternalResources: [], // "script"
  ProcessExternalResources: false
};

const buildEntityElement = require('./entity-builder');

const calculateEntityUrl = function(entityUrlId) {
  const parts = entityUrlId.split('|');
  return parts[0] === 'index' ? '' : parts[0];
};

module.exports = function(rootEntity, rootSchema, rootStyle, config) {
  return new Promise(function(resolve) {
    const entityUrlId = rootEntity.url;

    if (!entityUrlId) {
      throw new Error('required_entity_root_URLID');
    }

    const entityUrl = calculateEntityUrl(entityUrlId);

    const dom = new jsdom.JSDOM(`<!doctype html>
<html amp lang="${rootEntity.inLanguage || config.APP_LANG}">
<head>
<meta charset="utf-8">
${config.IS_ANALYTICS ? ampHelper.ANALYTICS_SCRIPT : ''}
${ampHelper.COMMON_SCRIPT}
<title>${rootEntity.name || rootEntity.headline}</title>
<link rel="canonical" href="${config.APP_DOMAIN}/${entityUrl}" />
<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
${ampHelper.COMMON_STYLE}
<style amp-custom>${rootStyle}</style>
</head>
<body>
<div id="root"></div>
${config.ANALYTICS_GOOGLE ? ampHelper.buildAnalyticsElement('googleanalytics', {
  vars: {
    account: config.ANALYTICS_GOOGLE
  },
  triggers: {
    track_pageview: {
      on: 'visible',
      request: 'pageview'
    }
  }
}) : ''}
${config.ANALYTICS_YANDEX ? ampHelper.buildAnalyticsElement('metrika', {
  vars: {
    counterId: config.ANALYTICS_YANDEX
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

    if (rootEntity.description) {
      // <meta name="description" content="${rootEntity.description}">
      // a problem with some symbols. like '"'
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = rootEntity.description
        .replace(/"/g, '')
        .replace(/\n/g, ' ');

      document.getElementsByTagName('head')[0].appendChild(meta);
    } else {
      console.log('warning_description: ' + entityUrl);
    }

    const rootContainer = document.getElementById('root');

    buildEntityElement(rootContainer,
                       [], // levelPaths (empty for a root)
                       rootSchema,
                       rootEntity,
                       // isGlobalDisplayOnly
                       true);

    ampHelper.convertImages(document);

    const headerElem = document.getElementById('root__name_content') ||
      document.getElementById('root__headline_content');

    if (!headerElem) { throw new Error('no_header'); }

    ampHelper.replaceTagName(document, headerElem, 'h1');

    setTimeout(function() {
      // TODO: add css before </head> here (to skip CSS serialization)
      // use dom.serialize() to generate markup
      resolve(dom);
    }, 0);
  });
};
