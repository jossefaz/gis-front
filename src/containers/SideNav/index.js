import PropTypes from "prop-types";
import React from "react";
import { Menu, Sidebar } from "semantic-ui-react";
import LayerList from "../../components/layers/LayerList/LayerList";
import { connect } from "react-redux";
import "./style.css";
const SideMenu = (props) => (
  <Sidebar.Pushable styleName="sidebar-container" className="cSideNav">
    <Sidebar
      as={Menu}
      vertical
      visible={props.ui.sideNavOpen}
      animation={"push"}
    >
      <LayerList />
    </Sidebar>
    <Sidebar.Pusher>{props.children}</Sidebar.Pusher>
  </Sidebar.Pushable>
);

SideMenu.propTypes = {
  visible: PropTypes.bool,
};
const mapStateToProps = (state) => {
  return { ui: state.ui };
};

export default connect(mapStateToProps, null)(SideMenu);
