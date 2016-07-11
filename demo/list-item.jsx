import React, { PropTypes } from "react";

export default class ListItem extends React.Component {
  render() {
    return (
      <div {...this.props} className={this.props.selected ? "selected" : ""}>
        {this.props.brand} - {this.props.model}
      </div>
    );
  }
}

ListItem.propTypes = {
  brand: PropTypes.string,
  model: PropTypes.string,
  selected: PropTypes.bool
};
