/* eslint-env browser */
import React from "react";
import RadonTypeahead from "../lib/components/typeahead";
import carBrandsArray from "./car-brands";

const TYPEAHEAD_DELAY = 1000;

export default class AjaxAhead extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedVal: ""
    };

    this.handleOnTypeaheadChange = this.handleOnTypeaheadChange.bind(this);
    this.handleOnTypeaheadSelection = this.handleOnTypeaheadSelection.bind(this);
  }

  handleOnTypeaheadChange(val, asyncListCallback) {
    // mimic async ajax call
    setTimeout(() => {
      // Make the ajax call with `val`
      const filteredList = carBrandsArray.filter((brand) => {
        return brand.toLowerCase().indexOf(val.toLowerCase()) === 0;
      });

      // success handler e.g. `success: function(res) { asyncListCallback(res.list); }`
      // handle case that val is empty
      asyncListCallback(val ? filteredList : []);

    }, TYPEAHEAD_DELAY);
  }

  handleOnTypeaheadSelection(val) {
    this.setState({
      selectedVal: val
    });
  }

  render() {
    return (
      <div>
        <p>Selected: {this.state.selectedVal}</p>
        <RadonTypeahead
          list={this.state.ajaxList}
          onChange={this.handleOnTypeaheadChange}
          onSelectOption={this.handleOnTypeaheadSelection}
          manualMode
        />
      </div>
    );
  }
}
