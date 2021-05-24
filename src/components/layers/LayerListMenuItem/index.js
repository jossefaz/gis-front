import React, { Component } from "react";
import { connect } from "react-redux";
import config from "../../../configuration";
import { Menu, Icon } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import { parseString } from "xml2js";
import { selectLayers } from "../../../state/selectors/layersSelector";
import API from "../../../core/api";
import LegendItem from "../../tool/InternalTool/Legend/LegendItem";
import EditTool from "../../tool/InternalTool/EditTool";
import LayerListTOF from "../LayerListTOF";
import SpatialSelect from "../../tool/InternalTool/SpatialSelect";
import { setMapLayerOpacity } from "../../../state/actions";
import "./style.scss";
import { ListGroup, Tab } from "react-bootstrap";
import TableOfFeatures from "../../tool/InternalTool/TableOfFeatures";


class LayerListMenuItem extends Component {
  state = {
    activeItem: null,
    boundingBox: null,
    map: null,
    OlLayer: null,
    showHide: true,
  };
  opacitySliderSettings = {
    start: this.props.opacity,
    min: 0,
    max: 1,
    step: 0.1,
    width: "15px",
    onChange: (value) => {
      this.props.setMapLayerOpacity(this.props.layer.uuid, value);
    },
  };

  handleItemClick = (name) => {
    if (this.state.activeItem === name) {
      return;
      this.setState(
        {
          showHide: !this.state.showHide,
          activeItem: name,
        },
        this.execAction(name)
      );
    } else {
      this.setState(
        {
          showHide: true,
          activeItem: name,
        },
        () => {
          this.execAction(name);
        }
      );
    }
  };

  execAction = (name) => {
    switch (name) {
      case "fullExtent":
        this.zoomToLayer(this.props.layer);
        break;
      default:
        break;
    }
  };
  getXMLResponse = async (url) => {
    try {
      const response = await fetch(url);
      let data = await response.text();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  zoomToLayer = (lyr) => {
    let map = API.map.getFocusedMap();
    if (lyr.restid) {
      this.setState({
        map: map,
      });

      if (this.state.boundingBox) this.fitExtent();
      else {
        let url = config().API["geoserver"];
        if (url) {
          this.getXMLResponse(
            url + "wms?&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities"
          ).then((response) => {
            let boundingBox;
            parseString(response, function (err, result) {
              let layers, layer;
              layers = result.WMS_Capabilities.Capability[0].Layer[0];
              layer = layers.Layer.find((l) =>
                l.Name.find((name) => {
                  return name === lyr.restid;
                })
              );
              if (layer) boundingBox = layer.BoundingBox[1].$;
            });
            this.setState({ boundingBox: boundingBox }, this.fitExtent);
          });
        }
      }
    }
  };

  fitExtent = () => {
    let { boundingBox, map } = this.state;
    if (boundingBox) {
      let res = map.getView().getResolution();
      let maxx = boundingBox.maxx;
      let maxy = boundingBox.maxy;
      let minx = boundingBox.minx;
      let miny = boundingBox.miny;

      map
        .getView()
        .fit([minx, miny, maxx, maxy], { constrainResolution: false });
      let newRes = map.getView().getResolution();
      if (newRes <= 0) this.map.getView().setResolution(res);
    }
  };

  render() {
    const { activeItem } = this.state;
    const { layer, visible } = this.props;
    const color = visible ? { color: "black" } : { color: "grey" };

    return (
      <Tab.Container defaultActiveKey="transparency" transition={false} activeKey={this.state.activeItem} onSelect={this.handleItemClick}>
        <ListGroup variant="flush" className="layers-list-item-menu">
          <ListGroup.Item eventKey="transparency" action>
            <div>שקיפות</div>
            <div className="flex-grow-1">
              <Slider
                disabled={!visible}
                settings={this.opacitySliderSettings}
              />
            </div>
          </ListGroup.Item>
          <ListGroup.Item eventKey="fullExtent" action>
            <div>מבט מלא על השכבה</div>
            <i className="gis-icon gis-icon--search-eye-thin"></i>
          </ListGroup.Item>
          <ListGroup.Item eventKey="editLayer" action>
            <div>ערוך שכבה</div>
            <i className="gis-icon gis-icon--graphic-pen-thin"></i>
          </ListGroup.Item>
          <ListGroup.Item eventKey="legend" action>
            <div>מקרא</div>
            <i className="gis-icon gis-icon--legend-thin"></i>
          </ListGroup.Item>
          <ListGroup.Item eventKey="attributeTable" action>
            <div>מאפיינים</div>
            <i className="gis-icon gis-icon--grid-thin"></i>
          </ListGroup.Item>
          <ListGroup.Item eventKey="spatialSelect" action>
            <div>ניתוח מרחבי</div>
            <i className="gis-icon gis-icon--search-eye-thin"></i>
          </ListGroup.Item>
        </ListGroup>

        {this.state.activeItem && <Tab.Content className="layers-list-item-menu-details">
          <div className="side-extra-container">
            <Tab.Pane eventKey="editLayer">
              <EditTool uuid={layer.uuid}></EditTool>
            </Tab.Pane>
            <Tab.Pane eventKey="legend">
              <LegendItem key={layer.uuid} uuid={layer.uuid} global={false}></LegendItem>
            </Tab.Pane>
            <Tab.Pane eventKey="attributeTable">
            <TableOfFeatures uuid={layer.uuid}  />
            </Tab.Pane>
            <Tab.Pane eventKey="spatialSelect">
            <SpatialSelect key={layer.uuid} uuid={layer.uuid} global={false}></SpatialSelect>
            </Tab.Pane>
          </div>
        </Tab.Content>}

      </Tab.Container>


      // <Nav className="flex-column" variant="pills" activeKey={this.state.activeItem} onSelect={this.handleItemClick}>
      //     <Nav.Link eventKey="transparency">שקיפות</Nav.Link>
      //     <Nav.Link eventKey="fullExtent">מבט מלא על השכבה</Nav.Link>
      //     <Nav.Link eventKey="editLayer">ערוך שכבה</Nav.Link>
      //     <Nav.Link eventKey="legend">מקרא</Nav.Link>
      //     <Nav.Link eventKey="attributeTable">מאפיינים</Nav.Link>
      //     <Nav.Link eventKey="spatialSelect">ניתוח מרחבי</Nav.Link>
      // </Nav>
    )

    return (
      <Menu secondary vertical className="content uirtl">
        <Menu.Item
          name="transparency"
          active={activeItem === "transparency"}
          onClick={this.handleItemClick}
        >
          <div style={color}>
            שקיפות
            <Slider
              style={{ width: "80%" }}
              color={visible ? "blue" : "grey"}
              disabled={!visible}
              settings={this.opacitySliderSettings}
            />
          </div>
        </Menu.Item>
        <Menu.Item
          name="fullExtent"
          active={activeItem === "fullExtent"}
          onClick={this.handleItemClick}
        >
          <div style={{ color: "black" }}>
            מבט מלא על השכבה
            <Icon link name="zoom" size="large" />
          </div>
        </Menu.Item>
        <Menu.Item
          name="editLayer"
          active={activeItem === "editLayer"}
          onClick={this.handleItemClick}
          disabled={!visible}
        >
          <div style={color}>
            ערוך שכבה
            <Icon link name="edit" size="large" />
          </div>
        </Menu.Item>
        <div>
          {this.state.activeItem === "editLayer" && this.state.showHide ? (
            <EditTool uuid={layer.uuid}></EditTool>
          ) : null}
        </div>
        <Menu.Item
          name="legend"
          active={activeItem === "legend"}
          onClick={this.handleItemClick}
        >
          <div style={{ color: "black" }}>
            מקרא
            <Icon link name="tasks" size="large" />
          </div>
        </Menu.Item>
        <div>
          {this.state.activeItem === "legend" && this.state.showHide ? (
            <LegendItem
              key={layer.uuid}
              uuid={layer.uuid}
              global={false}
            ></LegendItem>
          ) : null}
        </div>
        <Menu.Item
          name="attributeTable"
          active={activeItem === "attributeTable"}
          onClick={this.handleItemClick}
        >
          <div style={{ color: "black" }}>
            מאפיינים
            <Icon link name="table" size="large" />
          </div>
        </Menu.Item>
        <div>
          {this.state.activeItem === "attributeTable" && (
            <LayerListTOF openTable={this.state.showHide} uuid={layer.uuid} />
          )}
        </div>
        <Menu.Item
          name="spatialSelect"
          active={activeItem === "spatialSelect"}
          onClick={this.handleItemClick}
          disabled={!visible}
        >
          <div style={{ color: "black" }}>
            ניתוח מרחבי
            <Icon link name="tasks" size="large" />
          </div>
        </Menu.Item>
        <div>
          {this.state.activeItem === "spatialSelect" && this.state.showHide ? (
            <SpatialSelect
              key={layer.uuid}
              uuid={layer.uuid}
              global={false}
            ></SpatialSelect>
          ) : null}
        </div>
      </Menu>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    layer: selectLayers(state)[ownProps.layerId],
    opacity: selectLayers(state)[ownProps.layerId].opacity,
    visible: selectLayers(state)[ownProps.layerId].visible,
  };
};

export default connect(mapStateToProps, {
  setMapLayerOpacity,
})(LayerListMenuItem);
