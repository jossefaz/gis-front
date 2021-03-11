import PropTypes from "prop-types";
import React from "react";
import { Menu, Sidebar } from "semantic-ui-react";
import LayerListMain from "../../components/layers/LayerListMain";
import { connect } from "react-redux";
import "./style.css";
import { renderTools } from "../../components/tool/RenderTool";
import API from "../../core/api";
const SideMenu = (props) => {
  const currentMapId = API.map.getFocusedMapProxy()
    ? API.map.getFocusedMapProxy().uuid.value
    : null;

  return currentMapId ? (
    <Sidebar.Pushable styleName="sidebar-container" className="cSideNav">
      <Sidebar
        as={Menu}
        vertical
        visible={props.ui.sideNavOpen}
        animation={"push"}
      >
        {renderTools(props.Tools[currentMapId], "SideNav")}
        <LayerListMain />
      </Sidebar>
      <Sidebar.Pusher>{props.children}</Sidebar.Pusher>
    </Sidebar.Pushable>
  ) : null;
};

SideMenu.propTypes = {
  visible: PropTypes.bool,
};
const mapStateToProps = (state) => {
  return { ui: state.ui, Tools: state.Tools };
};

export default connect(mapStateToProps, null)(SideMenu);
