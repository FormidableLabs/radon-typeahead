import React, { PropTypes } from "react";

export default class ListItem extends React.Component {
  render() {
    const { brand, model, query, ...props } = this.props;
    return (
      <div {...props} className={this.props.selected ? "selected" : ""}>
        {brand} - {model}
      </div>
    );
  }
}

ListItem.propTypes = {
  brand: PropTypes.string,
  model: PropTypes.string,
  selected: PropTypes.bool
};
