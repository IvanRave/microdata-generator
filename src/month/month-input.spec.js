'use strict';

const expect = require('chai').expect;
const buildInput = require('./month-input');
const JSDOM = require('jsdom').JSDOM;

describe('microdata', function() {
  beforeEach(function() {
    const dom = new JSDOM('<!DOCTYPE html><body></body>');
    global.document = dom.window.document;
  });

  afterEach(function() {
    global.document = null;
  });

  it('should placeholder', function() {
    const input = buildInput();
    expect(input.type).equals('month');
    expect(input.readOnly).equals(false);
    input.value = '2017-12';
    expect(input.value).equals('2017-12');
    input.value = 'qwer';
    expect(input.value).equals('');
  });
});
