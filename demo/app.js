/*global document:false*/
import React from "react";
import ReactDOM from "react-dom";
import RadonTypeahead from "../src/index";
import ListItem from "./list-item";
import AjaxAhead from "./ajax-ahead";
import carBrandsArray from "./car-brands";
let carModelsArray = require("./car-models");

carModelsArray = carModelsArray
  .map((carBrandObj) => carBrandObj.models.map((model) => ({
    brand: carBrandObj.brand,
    model,
    value: model
  })))
  .reduce((acc, cur) => acc.concat(cur), []); // flatten

class App extends React.Component {
  static displayName = "App";

  constructor(props) {
    super(props);

    this.state = {
      complexList: [],
      complexCarBrand: ""
    };

    this.handleOnChangeComplexTypeahead = this.handleOnChangeComplexTypeahead.bind(this);
    this.handleOnNavigateToComplexOption = this.handleOnNavigateToComplexOption.bind(this);
    this.handleOnSelectComplexOption = this.handleOnSelectComplexOption.bind(this);
  }

  handleOnChangeComplexTypeahead(val) {
    let list = [];

    val = val.toLowerCase();

    // This typeahead matcher only matches beginning of string.
    if (val !== "") {
      // Users can type either a car brand or a model. Both would be fun but take more time to code.
      list = carModelsArray
        .filter((carBrandObj) => {
          const matchesBrand = carBrandObj.brand.toLowerCase().indexOf(val) === 0;
          const matchesModel = carBrandObj.model.toLowerCase().indexOf(val) === 0;

          return matchesBrand || matchesModel;
        })
        // Only show the first 7 entries
        .slice(0, 7); // eslint-disable-line no-magic-numbers
    }

    this.setState({
      complexList: list,
      complexCarBrand: ""
    });
  }

  handleOnNavigateToComplexOption(option) {
    this.setState({
      complexCarBrand: option.brand
    });
  }

  handleOnSelectComplexOption(option) {
    this.setState({
      complexCarBrand: option.brand,
      complexList: []
    });
  }

  render() {
    return (
      <div className="demo">
        <h3>Basic Typeahead</h3>
        <RadonTypeahead list={carBrandsArray} inputComponent={<input />}/>
        <h3>Complex Typeahead</h3>
        <p>Selected: {this.state.complexCarBrand}</p>
        <RadonTypeahead
          onChange={this.handleOnChangeComplexTypeahead}
          manualMode
          onArrowNavigation={this.handleOnNavigateToComplexOption}
          onSelectOption={this.handleOnSelectComplexOption}
          list={this.state.complexList}
          listItemComponent={<ListItem />}
        />
        <h3>AJAX Typeahead</h3>
        <AjaxAhead />
        <h3>Value passed down through props</h3>
        <RadonTypeahead value="Pass down this value please" manualMode />
      </div>
    );
  }
}

const content = document.getElementById("content");

ReactDOM.render(<App/>, content);
