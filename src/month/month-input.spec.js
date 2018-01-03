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

  it('should monthInput', function() {
    const input = buildInput();
    expect(input.type).equals('select-one');
    expect(input.multiple).equals(false);
    input.value = '1';
    expect(input.value).equals('1');
  });

  it('should wrong monthInput', function() {
    const input = buildInput();
    input.value = '12';
    expect(input.value).equals('');
  });

  it('should options.length', function() {
    const input = buildInput();
    expect(input.options.length).equals(13);
  });

  it('should options second', function() {
    const input = buildInput();
    const someOption = input.options[5];
    expect(someOption.value).equals('4');
    expect(someOption.textContent).equals('May');
  });
});
