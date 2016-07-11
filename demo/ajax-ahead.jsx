/* eslint-env browser */
import React from "react";
import RadonTypeahead from "../lib/components/typeahead";
import carBrandsArray from "./car-brands";

export default React.createClass({
  getInitialState() {
    return {
      selectedVal: ""
    };
  },
  onTypeaheadChange(val, asyncListCallback) {
    // mimic async ajax call
    setTimeout(() => {
      // Make the ajax call with `val`
      const filteredList = carBrandsArray.filter((brand) => {
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
          manualMode
        />
      </div>
    );
  }
});
