'use strict';

const expect = require('chai').expect;
const ageInput = require('./age-input');
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
    const input = ageInput();
    expect(input.placeholder).equals('0-120');
  });
});
