import React from "react";
import PropTypes from "prop-types";

// Note: We don't use `query`, but need it to be sliced off the `...props`.
// eslint-disable-next-line no-unused-vars
const ListItem = ({ brand, model, query, ...props }) => (
  <div {...props} className={props.selected ? "selected" : ""}>
    {brand} - {model}
  </div>
);

ListItem.propTypes = {
  brand: PropTypes.string,
  model: PropTypes.string,
  query: PropTypes.string,
  selected: PropTypes.bool
};

export default ListItem;
