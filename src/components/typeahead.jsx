import React, { PropTypes } from "react";
import ReactDOM from "react-dom";

const keyboard = {
  space: 32,
  enter: 13,
  escape: 27,
  tab: 9,
  upArrow: 38,
  downArrow: 40
};

export default React.createClass({
  displayName: "RadonTypeahead",
  propTypes: {
    inputComponent: PropTypes.element,
    list: PropTypes.array,
    listClassName: PropTypes.string,
    listItemComponent: PropTypes.element,
    listStyle: PropTypes.object,
    mainStyle: PropTypes.object,
    manualMode: PropTypes.bool,
    onArrowNavigation: PropTypes.func,
    onChange: PropTypes.func,
    onResetVal: PropTypes.func,
    onSelectOption: PropTypes.func
  },
  getDefaultProps() {
    return {
      list: [],
      manualMode: false,
      onChange() {}
    };
  },
  getInitialState() {
    return {
      val: "",
      oldVal: "",
      selectedOptionIndex: false,
      list: [],
      listOpen: false,
      touchScroll: false
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.list && nextProps.manualMode === true) {
      this.setState({
        list: nextProps.list,
        listOpen: nextProps.list.length !== 0
      });
    }
  },
  hideList() {
    this.setState({
      listOpen: false
    });
  },
  onChange(ev) {
    const val = ev.target.value;
    const state = {
      list: [],
      listOpen: false,
      selectedOptionIndex: false,
      val
    };

    if (this.props.inputComponent && this.props.inputComponent.props.onChange) {
      this.props.inputComponent.props.onChange(ev);
    }

    if (!this.props.manualMode) {
      if (val !== "") {
        // This typeahead matcher only matches beginning of string.
        state.list = this.props.list.filter((item) => {
          return item.toLowerCase().indexOf(val.toLowerCase()) === 0;
        });

        if (state.list.length !== 0) {
          state.listOpen = true;
        }
      }
    }

    this.setState(state);

    // This value won't have propagated to the DOM yet.
    // Could put this in the setState callback but this alerts the implementor
    // faster
    if (this.props.manualMode) {
      // add an async callback for updating the list
      this.props.onChange(val, (list) => {
        if (list) {
          this.setState({
            list,
            // if the list comes back empty
            listOpen: list.length !== 0
          });
        } else {
          this.setState({
            listOpen: false
          });
        }
      });
    } else {
      this.props.onChange(val);
    }
  },
  resetOldVal() {
    this.setState({
      selectedOptionIndex: false,
      val: this.state.oldVal,
      oldVal: ""
    });

    if (typeof this.props.onResetVal === "function") {
      this.props.onResetVal(this.state.oldVal);
    }
  },
  setNewSelectedIndex(index, oldVal) {
    const option = this.state.list[index];
    const state = {
      selectedOptionIndex: index,
      oldVal: typeof oldVal === "undefined" ? this.state.oldVal : oldVal
    };

    // If it's not a string, or doesn"t have a `value` property, we can't use it
    if (typeof option === "string") {
      state.val = option;
    } else if (typeof option === "object" && option.value) {
      state.val = option.value;
    }

    this.setState(state, () => {
      if (typeof this.props.onArrowNavigation === "function") {
        this.props.onArrowNavigation(option, index);
      }
    });
  },
  moveIndexByOne(decrement) {
    const currentOption = this.state.selectedOptionIndex;
    const listLength = this.state.list.length;

    // keyboard navigation from the input
    if (currentOption === false) {
      // decrement wraps to the last value. Pass in current val to be cached
      this.setNewSelectedIndex(decrement ? listLength - 1 : 0, this.state.val);
    // keyboard navigation from an option
    // Navigation off either end of the list
    } else if (decrement && currentOption === 0 || !decrement && currentOption === listLength - 1) {
      // Go back to the input and reset cached value
      this.resetOldVal();
    } else {
      this.setNewSelectedIndex(currentOption + (decrement ? -1 : 1));
    }
  },
  // Arrow keys are only captured by onKeyDown not onKeyPress
  // http://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript
  onKeyDown(i, ev) {
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
  onBlur(ev) {
    // Clicks on the scrollbar will trigger the blur event, which can cause some
    // unintended behavior. However, the only way we can evaluate if this was
    // indeed a scrollbar click, is to check if any of this component's children
    // have a "hover". So, if the mouse is hovering within our typeahead during
    // this blur event, instead of hiding the list, we'll consider it to be a
    // scroll click and do nothing.
    const hoveredSelectEl = ReactDOM.findDOMNode(this).querySelector(":hover");
    if (hoveredSelectEl) {
      return;
    }

    if (this.props.inputComponent && this.props.inputComponent.props.onBlur) {
      this.props.inputComponent.props.onBlur(ev);
    }

    this.hideList();
  },
  onClickOption(index) {
    const option = this.state.list[index];
    const state = {
      listOpen: false,
      selectedOptionIndex: false
    };

    if (!this.props.manualMode) {
      state.list = [];
    }

    if (typeof option === "string") {
      state.val = option;
    } else if (typeof option === "object" && option.value) {
      state.val = option.value;
    }

    this.setState(state);

    if (typeof this.props.onSelectOption === "function") {
      this.props.onSelectOption(option, index);
    }
  },
  onMouseDown(ev) {
    // ensure clicks on the scrollbar do not steal focus
    if (this.state.listOpen) {
      ev.preventDefault();
    }
  },
  // Once the user has let up on a touch, determine whether their touch was part
  // of a scrolling gesture (via the state variable, `touchScroll`).
  // If it was indeed a scroll gesture, we'll consider it a no-op and reset the
  // state variable. We'll only consider the touch a selection in the case that
  // they did not drag at all between the time of touch start and touch end.
  onTouchEnd(index) {
    if (!this.state.touchScroll) {
      this.onClickOption(index);
    }

    this.setState({touchScroll: false});
  },
  // Capture a mouse drag on a typeahead suggestion and consider it as a
  // "scrolling" gesture. We'll track this scrolling as a state variable,
  // `touchScroll`.
  onTouchMove() {
    this.setState({touchScroll: true});
  },
  render() {
    return (
      <div style={this.props.mainStyle}>
        {React.cloneElement(
          this.props.inputComponent || <input />,
          {
            value: this.state.val,
            onChange: this.onChange,
            onKeyDown: this.onKeyDown.bind(this, false),
            onBlur: this.onBlur
          })
        }
        {this.state.listOpen ?
          <div
            className={this.props.listClassName || "typeahead-list"}
            style={this.props.listStyle}
            onMouseDown={this.onMouseDown}
          >
            {this.state.list.map((item, i) => {
              let props = {
                children: {}
              };

              if (typeof item === "string") {
                props.children = item;
              } else {
                props = item;
              }

              props.key = i;
              props.ref = i;
              props.query = this.state.selectedOptionIndex !== false ?
                this.state.oldVal : this.state.val;
              props.onMouseDown = this.onClickOption.bind(this, i);

              // This is a workaround for a long-standing iOS/React issue with
              // click events. See https://github.com/facebook/react/issues/134
              // for more information.
              props.onTouchEnd = this.onTouchEnd.bind(this, i);
              props.onTouchMove = this.onTouchMove;

              props.role = "button";
              props.selected = i === this.state.selectedOptionIndex;
              props.tabIndex = -1;

              return React.cloneElement(
                this.props.listItemComponent ||
                  <div className={props.selected ? "selected" : ""} />,
                props
              );
            })}
          </div>
          :
          ""
        }
      </div>
    );
  }
});
