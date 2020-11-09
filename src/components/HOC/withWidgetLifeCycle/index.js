import React, { Component } from "react";
import { unsetUnfocused } from "../../../redux/actions/tools";
import { connect } from "react-redux";
import { getFocusedMapProxy } from "../../../nessMapping/api";
import _ from "lodash";
export default (WrappedComponent) => {
  class withWidgetLifeCycle extends React.Component {
    constructor(props) {
      super(props);
      this.child = React.createRef();
    }

    state = {
      toolorder: null,
    };

    get Tools() {
      const currentMapId = getFocusedMapProxy()
        ? getFocusedMapProxy().uuid.value
        : null;
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
          this.setState({ toolorder: this.Tools.order });
        }
        if (
          this.Tools.order[0] == this.props.toolID &&
          typeof onFocus == "function" &&
          !_.isEqual(this.state.toolorder, this.Tools.order)
        ) {
          onFocus();
          this.setState({ toolorder: this.Tools.order });
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
