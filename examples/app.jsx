var React = require('react');
var _ = require('lodash');
var RadonTypeahead = require('../lib/typeahead.js');
var ListItem = require('./list-item.jsx');
var carBrandsArray = require('./list-of-car-brands.js');
var carModelsArray = require('./list-of-car-models.js');

carModelsArray = _(_.cloneDeep(carModelsArray))
  .map(function (carBrandObj) {
    return _.map(carBrandObj.models, function (model) {
      return {
        brand: carBrandObj.brand,
        model,
        value: model
      };
    });
  })
  .flatten()
  .value();

var App = React.createClass({
  displayName: 'App',
  getInitialState() {
    return {
      complexList: [],
      complexCarBrand: '',
    };
  },
  onChangeComplexTypeahead(val) {
    var list = [];

    val = val.toLowerCase();

    // This typeahead matcher only matches beginning of string.
    if (val !== '') {
      // Users can type either a car brand or a model. Both would be fun but take more time to code.
      list = _(carModelsArray)
        .filter(function (carBrandObj) {
          var matchesBrand = carBrandObj.brand.toLowerCase().indexOf(val) === 0;
          var matchesModel = carBrandObj.model.toLowerCase().indexOf(val) === 0;

          return matchesBrand || matchesModel;
        })
        // Only show the first 7 entries
        .slice(0, 7)
        .value();
    }

    this.setState({
      complexList: list,
      complexCarBrand: ''
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
      <div>
        <h3>Basic Typeahead</h3>
        <RadonTypeahead list={carBrandsArray} inputComponent={<input />}/>
        <h3>Complex Typeahead</h3>
        {this.state.complexCarBrand}<RadonTypeahead
          onChange={this.onChangeComplexTypeahead}
          manualMode={true}
          onArrowNavigation={this.onNavigateToComplexOption}
          onSelectOption={this.onSelectComplexOption}
          list={this.state.complexList}
          listItemComponent={<ListItem />} />
      </div>
    );
  }
});

React.render(<App />, document.getElementById('root'));