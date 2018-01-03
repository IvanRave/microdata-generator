'use strict';

const expect = require('chai').expect;
const buildInput = require('./date-input');
const JSDOM = require('jsdom').JSDOM;

describe('microdata', function() {
  beforeEach(function() {
    const dom = new JSDOM('<!DOCTYPE html><body></body>');
    global.document = dom.window.document;
  });

  afterEach(function() {
    global.document = null;
  });

  it('should date-input', function() {
    const input = buildInput();
    expect(input.type).equals('date');
    expect(input.readOnly).equals(false);
    input.value = '2017-12-01';
    expect(input.value).equals('2017-12-01');
  });

  it('should wrong date-input', function() {
    const input = buildInput();
    expect(input.type).equals('date');
    expect(input.readOnly).equals(false);
    input.value = '2017-12';
    expect(input.value).equals('');
  });

  it('should date-input asDate', function() {
    const input = buildInput();
    input.value = '2017-12-31';
    const date = new Date(input.value);
    const local = date.toLocaleDateString();
    expect(local).deep.equals('12/31/2017');
  });
});
