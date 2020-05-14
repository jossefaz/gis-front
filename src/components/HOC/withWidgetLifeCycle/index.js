
import React, { Component } from 'react'
import { unsetUnfocused } from "../../../redux/actions/tools";
import { connect } from "react-redux";
import { getFocusedMapProxy } from "../../../nessMapping/api"
export default (WrappedComponent) => {

    class withWidgetLifeCycle extends React.Component {

        constructor(props) {
            super(props);
            this.child = React.createRef();
        }


        get Tools() {
            const currentMapId = getFocusedMapProxy() ? getFocusedMapProxy().uuid.value : null
            return currentMapId ? this.props.Tools[currentMapId] : null
        }

        componentDidUpdate() {
            const { onFocus, onReset, onUnfocus } = this.child.current
            if (this.Tools) {
                if (this.Tools.unfocus == this.props.toolID && typeof onUnfocus === "function") {

                    onUnfocus()
                    this.props.unsetUnfocused(this.props.toolID)
                }
                if (this.Tools.order[0] == this.props.toolID && typeof onFocus === "function") {
                    onFocus()
                }
                if (this.Tools.reset.length > 0 && typeof onReset === "function") {
                    this.Tools.reset.map(toolid => {
                        if (toolid == this.props.toolID) {
                            onReset()
                        }
                    })
                }
            }
        }

        render() {
            return <WrappedComponent ref={this.child} {...this.props} />;
        }
    };

    const mapStateToProps = (state) => {
        return {
            Tools: state.Tools,
        };
    };
    return connect(
        mapStateToProps,
        { unsetUnfocused },
    )(withWidgetLifeCycle);
}