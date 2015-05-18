var React = require('react');

module.exports = React.createClass({
  render() {
    return <div {...this.props} className={this.props.selected ? 'selected' : ''}>
      {this.props.brand} - {this.props.model}
    </div>
  }
});