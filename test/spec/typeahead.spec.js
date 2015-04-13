'use strict';

describe('Button', function () {

  var React = require('react');

  var typeahead = require('typeahead.jsx');
  var container, component;

  describe('Mounting', function () {

    beforeEach(function () {
      container = document.createElement('div');
      component = React.render(
        React.createElement(typeahead, {list: ['test1', 'test2']}, {}),
        container
      );
    });

    afterEach(function () {
      React.unmountComponentAtNode(container);
    });

    it('should render into the document', function () {
      expect(component.isMounted()).to.be.true;
    });
  });
});
