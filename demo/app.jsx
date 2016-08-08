/*global document:false*/
import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import RadonTypeahead from "../src/index";
import ListItem from "./list-item";
import AjaxAhead from "./ajax-ahead";
import carBrandsArray from "./car-brands";
let carModelsArray = require("./car-models");

carModelsArray = _(carModelsArray)
  .map((carBrandObj) => {
    return _.map(carBrandObj.models, (model) => {
      return {
        brand: carBrandObj.brand,
        model,
        value: model
      };
    });
  })
  .flatten()
  .value();

const App = React.createClass({
  displayName: "App",
  getInitialState() {
    return {
      complexList: [],
      complexCarBrand: ""
    };
  },
  onChangeComplexTypeahead(val) {
    let list = [];

    val = val.toLowerCase();

    // This typeahead matcher only matches beginning of string.
    if (val !== "") {
      // Users can type either a car brand or a model. Both would be fun but take more time to code.
      list = _(carModelsArray)
        .filter((carBrandObj) => {
          const matchesBrand = carBrandObj.brand.toLowerCase().indexOf(val) === 0;
          const matchesModel = carBrandObj.model.toLowerCase().indexOf(val) === 0;

          return matchesBrand || matchesModel;
        })
        // Only show the first 7 entries
        .slice(0, 7)
        .value();
    }

    this.setState({
      complexList: list,
      complexCarBrand: ""
    });
  },
  onNavigateToComplexOption(option) {
    this.setState({
      complexCarBrand: option.brand
    });
  },
  onSelectComplexOption(option) {
    this.setState({
      complexCarBrand: option.brand,
      complexList: []
    });
  },
  render() {
    return (
      <div className="demo">
        <h3>Basic Typeahead</h3>
        <RadonTypeahead list={carBrandsArray} inputComponent={<input />}/>
        <h3>Complex Typeahead</h3>
        <p>Selected: {this.state.complexCarBrand}</p>
        <RadonTypeahead
          onChange={this.onChangeComplexTypeahead}
          manualMode
          onArrowNavigation={this.onNavigateToComplexOption}
          onSelectOption={this.onSelectComplexOption}
          list={this.state.complexList}
          listItemComponent={<ListItem />}
        />
        <h3>AJAX Typeahead</h3>
        <AjaxAhead />
        <h3>Value passed down through props</h3>
        <RadonTypeahead val="Pass down this value please" manualMode />
      </div>
    );
  }
});

const content = document.getElementById("content");

ReactDOM.render(<App/>, content);
