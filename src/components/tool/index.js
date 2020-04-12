import React, { lazy } from "react";
import Iframe from "react-iframe";
import { connect } from "react-redux";
import { toggleTool } from "../../redux/actions/tools";
import PopUp from "../popup";
class Loader extends React.Component {
  componentDidMount() {
    window.addEventListener("message", function (e) {
      this.console.log(e);
    });
  }

  render() {
    const { IsOpen, ToolInvokerType, ToolLocation } = this.props.Tools[
      this.props.ToolID
    ];
    return (
      <div>
        <button onClick={this.props.toggleTool}>Toggle Html</button>
        {IsOpen ? (
          ToolInvokerType ? (
            <PopUp>
              <Iframe url={ToolLocation} />
            </PopUp>
          ) : (
            <PopUp>{lazy(() => import(ToolLocation))}</PopUp>
          )
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};

export default connect(mapStateToProps, { toggleTool })(Loader);
