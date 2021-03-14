import React, { Component } from "react";
import { unsetUnfocused } from "../../../state/actions";
import { connect } from "react-redux";
import API from "../../../core/api";
import _ from "lodash";
export default (WrappedComponent) => {
  class withWidgetLifeCycle extends React.Component {
    constructor(props) {
      super(props);
      this.child = React.createRef();
    }

    state = {
      focused: null,
    };

    get Tools() {
      const currentMapId = API.map.getFocusedMapUUID();
      return currentMapId ? this.props.Tools[currentMapId] : null;
    }

    componentDidUpdate() {
      const { onFocus, onReset, onUnfocus } = this.child.current;
      if (this.Tools) {
        if (
          this.Tools.unfocus == this.props.toolID &&
          typeof onUnfocus == "function"
        ) {
          onUnfocus();
          this.props.unsetUnfocused(this.props.toolID);
          this.setState({ toolorder: this.Tools.dynamicTools });
        }
        if (
          this.Tools.focused == this.props.toolID &&
          typeof onFocus == "function" &&
          this.state.focused !== this.Tools.focused
        ) {
          onFocus();
          this.setState({ focused: this.Tools.focused });
        }
        if (this.Tools.reset.length > 0 && typeof onReset === "function") {
          this.Tools.reset.map((toolid) => {
            if (toolid === this.props.toolID) {
              onReset();
            }
          });
        }
      }
    }

    render() {
      return <WrappedComponent ref={this.child} {...this.props} />;
    }
  }

  const mapStateToProps = (state) => {
    return {
      Tools: state.Tools,
    };
  };
  return connect(mapStateToProps, { unsetUnfocused })(withWidgetLifeCycle);
};
