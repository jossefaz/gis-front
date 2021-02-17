import React from "react";
import { connect } from "react-redux";
import { toogleSideNav } from "../../redux/actions/ui";
import { renderTools } from "../../components/tool/func";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFocusedMapProxy } from "../../nessMapping/api";
import SeachComp from "../../components/Search";
import { ListGroup } from "react-bootstrap";

class TopNav extends React.Component {

  state = {
    itemSelected: false,
    opened: true
  }

  open = () => {
    this.setState({ opened: true })
  }

  close = () => {
    this.setState({opened: false});
  }

  get Tools() {
    return getFocusedMapProxy()
      ? this.props.Tools[getFocusedMapProxy().uuid.value]
      : null;
  }

  render() {
    return (
      <div
        onMouseEnter={this.open}
        onMouseLeave={this.close}
        className={`main-nav ${(!this.state.opened && this.state.itemSelected) ? "main-nav--closed" : ""}`}>
        <ListGroup>
          {/* <ListGroup.Item><SeachComp /></ListGroup.Item> */}
          {renderTools(this.Tools, "TopNav")}
        </ListGroup>
      </div>
    );

    return (
      <div className="ui top fixed menu ">
        <div className="item align left">
          <SeachComp />
        </div>
        {renderTools(this.Tools, "TopNav")}
        <button
          className="ui fixed item image pointerCursor"
          onClick={() => this.props.toogleSideNav()}
        >
          <FontAwesomeIcon icon="layer-group" size="lg" />
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};
export default connect(mapStateToProps, { toogleSideNav })(TopNav);
