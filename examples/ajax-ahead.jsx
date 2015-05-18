var React = require('react');
var RadonTypeahead = require('../lib/typeahead.js');
var carBrandsArray = require('./list-of-car-brands.js');

module.exports = React.createClass({
  getInitialState() {
    return {
      selectedVal: ''
    };
  },
  onTypeaheadChange(val, asyncListCallback) {
    // mimic async ajax call
    setTimeout(() => {
      // Make the ajax call with `val`
      var filteredList = carBrandsArray.filter(function (brand) {
        return brand.toLowerCase().indexOf(val.toLowerCase()) === 0;
      });

      // success handler e.g. `success: function(res) { asyncListCallback(res.list); }`
      // handle case that val is empty
      asyncListCallback(val ? filteredList : []);

    }, 1000);
  },
  onTypeaheadSelection(val) {
    this.setState({
      selectedVal: val
    });
  },
  render() {
    return (
      <div>
        <p>Selected: {this.state.selectedVal}</p>
        <RadonTypeahead
          list={this.state.ajaxList}
          onChange={this.onTypeaheadChange}
          onSelectOption={this.onTypeaheadSelection}
          manualMode={true} />
      </div>
    );
  }
});