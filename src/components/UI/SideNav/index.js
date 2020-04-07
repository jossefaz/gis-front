import PropTypes from "prop-types";
import React from "react";
import { Icon, Menu, Sidebar } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import LayerList from "../../layers/LayerList/LayerList";

const SideMenu = (props) => (
  <Sidebar.Pushable styleName="sidebar-container">
    <Sidebar as={Menu} vertical visible={props.visible} animation={"push"}>
      <LayerList />
    </Sidebar>
    <Sidebar.Pusher>{props.children}</Sidebar.Pusher>
  </Sidebar.Pushable>
);

SideMenu.propTypes = {
  visible: PropTypes.bool,
};
export default SideMenu;
