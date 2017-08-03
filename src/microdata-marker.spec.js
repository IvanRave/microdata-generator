'use strict';

const expect = require('chai').expect;
const helper = require('./microdata-marker');
const JSDOM = require('jsdom').JSDOM;

describe('microdata', function() {
  let container;

  beforeEach(function() {
    const dom = new JSDOM(`<!DOCTYPE html><body></body>`);

    global.document = dom.window.document;
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function() {
    container = null;
    global.document = null;
  });

  it('should isElementList true', function() {
    container.innerHTML = '<ul itemprop="hasOfferCatalog" itemscope itemtype="http://schema.org/OfferCatalog"></ul>';

    const result = helper.isElementList(container.querySelector('ul'));

    expect(result).to.true;
  });

  it('should markEntityList', function() {
    helper.markEntityList(container, 'breadcrumb');

    expect(container.outerHTML).to.equal('<div itemscope="" itemtype="http://schema.org/BreadcrumbList"></div>');

    helper.markEntityList(container, 'hasOfferCatalog');

    expect(container.outerHTML).to.equal('<div itemscope="" itemtype="http://schema.org/OfferCatalog"></div>');

    helper.markEntityList(container, 'anyprop');

    expect(container.outerHTML).to.equal('<div itemscope="" itemtype="http://schema.org/ItemList"></div>');
  });

  it('should markProperty:simple', function() {
    container.textContent = 'demoPropertyValue';

    helper.markProperty(container, 'demoProperty', null, true, []);

    expect(container.outerHTML).to.equal('<div itemprop="demoProperty">demoPropertyValue</div>');
  });

  it('should markProperty:content', function() {
    container.setAttribute('content', 'demoPropertyValue');

    helper.markProperty(container, 'demoProperty', null, true, []);

    expect(container.outerHTML).to.equal('<div content="demoPropertyValue" itemprop="demoProperty"></div>');
  });

  it('should markProperty:img', function() {
    const img = document.createElement('img');
    img.src = '#';

    helper.markProperty(img, 'demoProperty', null, true, []);

    expect(img.outerHTML).to.equal('<img src="#" itemprop="demoProperty">');
  });

  it('should markProperty:sameAsProperty', function() {
    container.textContent = '123';
    helper.markProperty(container, 'demoProperty', 'otherProperty', true, []);

    expect(container.outerHTML).to.equal('<div itemprop="demoProperty otherProperty">123</div>');
  });

  it('should markProperty:sameAsProperty as sameAs', function() {
    container.textContent = '123';
    helper.markProperty(container, 'demoProperty', 'sameAs', true, []);

    expect(container.outerHTML).to.equal('<div itemprop="sameAs">123</div>');
  });
});
