'use strict';
var React = require('react');
var cloneWithProps = require('react/lib/cloneWithProps');
var filter = require('lodash.filter');

var keyboard = {
  space: 32,
  enter: 13,
  escape: 27,
  tab: 9,
  upArrow: 38,
  downArrow: 40
};

var classBase = React.createClass({
  displayName: 'RadonSelect',
  propTypes: {
  },
  getDefaultProps:function () {
    return {
      list: [],
      manualMode: false,
      onChange:function () {}
    };
  },
  getInitialState:function () {
    return {
      val: '',
      oldVal: '',
      selectedOptionIndex: false,
      list: [],
      listOpen: false
    };
  },
  componentWillReceiveProps:function(nextProps) {
    if (nextProps.list && nextProps.manualMode === true) {
      this.setState({
        list: nextProps.list,
        listOpen: nextProps.list.length !== 0
      });
    }
  },
  hideList:function () {
    this.setState({
      listOpen: false
    });
  },
  onChange:function (ev) {
    var val = ev.target.value;
    var state = {
      list: [],
      listOpen: false,
      selectedOptionIndex: false,
      val:val
    };

    if (this.props.inputComponent && this.props.inputComponent.props.onChange) {
      this.props.inputComponent.props.onChange(ev);
    }

    if (!this.props.manualMode) {
      if (val !== '') {
        // This typeahead matcher only matches beginning of string.
        state.list = filter(this.props.list, function (item) {
          return item.toLowerCase().indexOf(val.toLowerCase()) === 0;
        });

        if (state.list.length !== 0) {
          state.listOpen = true;
        }
      }
    }

    this.setState(state);

    // This value won't have propagated to the DOM yet.
    // Could put this in the setState callback but this alerts the implementor faster
    if (this.props.manualMode) {
      // add an async callback for updating the list
      this.props.onChange(val, function(list)  {
        if (list) {
          this.setState({
            list:list,
            // if the list comes back empty
            listOpen: list.length !== 0
          });
        } else {
          this.setState({
            listOpen: false
          });
        }
      }.bind(this));
    } else {
      this.props.onChange(val);
    }
  },
  resetOldVal:function () {
    this.setState({
      selectedOptionIndex: false,
      val: this.state.oldVal,
      oldVal: ''
    });

    if (typeof this.props.onResetVal === 'function') {
      this.props.onResetVal(this.state.oldVal);
    }
  },
  setNewSelectedIndex:function (index, oldVal) {
    var option = this.state.list[index];
    var state = {
      selectedOptionIndex: index,
      oldVal: typeof oldVal === 'undefined' ? this.state.oldVal : oldVal
    };

    // If it's not a string, or doesn't have a `value` property, we can't use it
    if (typeof option === 'string') {
      state.val = option;
    } else if (typeof option === 'object' && option.value) {
      state.val = option.value;
    }

    this.setState(state, function () {
      if (typeof this.props.onArrowNavigation === 'function') {
        this.props.onArrowNavigation(option, index);
      }
    });
  },
  moveIndexByOne:function (decrement) {
    var currentOption = this.state.selectedOptionIndex;
    var listLength = this.state.list.length;

    // keyboard navigation from the input
    if (currentOption === false) {
      // decrement wraps to the last value. Pass in current val to be cached
      this.setNewSelectedIndex(decrement ? listLength - 1 : 0, this.state.val);
    // keyboard navigation from an option
    } else {
      // Navigation off either end of the list
      if (decrement && currentOption === 0 || !decrement && currentOption === listLength - 1) {
        // Go back to the input and reset cached value
        this.resetOldVal();
      } else {
        this.setNewSelectedIndex(currentOption + (decrement ? -1 : 1));
      }
    }
  },
  // Arrow keys are only captured by onKeyDown not onKeyPress
  // http://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript
  onKeyDown:function (i, ev) {
    if (this.props.inputComponent && this.props.inputComponent.props.onKeyDown) {
      this.props.inputComponent.props.onKeyDown(ev);
    }

    if (!this.state.list || this.state.list.length === 0) {
      return;
    }

    // escape always closes the list
    if (ev.keyCode === keyboard.escape) {
      ev.preventDefault();
      this.hideList();

      return;
    // Arrow keys behave similarly in the input and when option selected
    } else if (ev.keyCode === keyboard.upArrow || ev.keyCode === keyboard.downArrow) {
      ev.preventDefault();

      this.moveIndexByOne(/*decrement*/ ev.keyCode === keyboard.upArrow);
    // If they are on an option, tab, enter and escape have different behavior
    } else if (this.state.selectedOptionIndex !== false) {
      // Enter and tab behave like a click
      if (ev.keyCode === keyboard.tab || ev.keyCode === keyboard.enter) {
        ev.preventDefault();
        this.onClickOption(this.state.selectedOptionIndex);
      }
    }
  },
  onBlur:function (ev) {
    if (this.props.inputComponent && this.props.inputComponent.props.onBlur) {
      this.props.inputComponent.props.onBlur(ev);
    }

    this.hideList();
  },
  onClickOption:function (index) {
    var option = this.state.list[index];
    var state = {
      listOpen: false,
      selectedOptionIndex: false
    };

    if (!this.props.manualMode) {
      state.list = [];
    }

    if (typeof option === 'string') {
      state.val = option;
    } else if (typeof option === 'object' && option.value) {
      state.val = option.value
    }

    this.setState(state);

    if (typeof this.props.onSelectOption === 'function') {
      this.props.onSelectOption(option, index);
    }
  },
  render:function () {
    return (
      React.createElement("div", {style: this.props.mainStyle}, 
        React.cloneElement(
          this.props.inputComponent || React.createElement("input", null),
          {
            value: this.state.val,
            onChange: this.onChange,
            onKeyDown: this.onKeyDown.bind(this, false),
            onBlur: this.onBlur
          }), 
        
        this.state.listOpen ?
          React.createElement("div", {className: this.props.listClassName || 'typeahead-list', style: this.props.listStyle}, 
            this.state.list.map(function(item, i)  {
              var props = {
                children: {}
              };

              if (typeof item === 'string') {
                props.children = item;
              } else {
                props = item;
              }

              props.key = i;
              props.ref = i;
              props.query = this.state.selectedOptionIndex !== false ? this.state.oldVal : this.state.val;
              props.onMouseDown = this.onClickOption.bind(this, i);
              props.role = 'button';
              props.selected = i === this.state.selectedOptionIndex;
              props.tabIndex = -1;

              return cloneWithProps(
                this.props.listItemComponent || React.createElement("div", {className: props.selected ? 'selected' : ''}),
                props
              );
            }.bind(this))
          )
          :
          ''
        
      )
    );
  }
});

module.exports = classBase;
