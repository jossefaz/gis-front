import React, { useState } from "react";
import { connect } from "react-redux";
import {
  getOlLayer,
  getFocusedMap,
  getFocusedMapProxy,
  getCurrentResolution,
  getCurrentExtent,
  getCurrentProjection,
} from "../../../../../nessMapping/api";
import { selectCurrentMapLayers } from "../../../../../redux/reducers";
import { Accordion, Icon } from "semantic-ui-react";
import { getHeight, getWidth } from "ol/extent";
import { Checkbox } from "semantic-ui-react";
import config from "react-global-configuration";
const LegendItem = (props) => {
  const [active, toggle] = useState(true);
  const [resolution, setResolution] = useState();

  const focusedMapUUID = () =>
    getFocusedMapProxy() ? getFocusedMapProxy().uuid.value : false;

  getFocusedMap()
    .getView()
    .on("change:resolution", function (event) {
      setResolution(getCurrentResolution());
    });
  getFocusedMap().on("moveend", () => setResolution(getCurrentResolution()));
  const renderLegendItem = () => {
    const layer = getOlLayer(props.uuid);
    const crs = `&CRS=${getCurrentProjection().getCode()}`;
    const heightAndWidth = `&srcwidth=${getHeight(
      getCurrentExtent()
    )}&srcheight=${getWidth(getCurrentExtent())}`;
    let url;
    let name;
    if (layer) {
      const baseurl = layer.getSource().getLegendUrl();

      const cql = `&BBOX=${getCurrentExtent().join(",")}`;

      name = props.Layers[props.uuid].restid;
      url = `${baseurl}${cql}${crs}${heightAndWidth}&legend_options=countMatched:true;fontAntiAliasing:true;hideEmptyRules:true;forceLabels:on`;
    } else {
      if (props.uuid in props.Layers) {
        const { restid } = props.Layers[props.uuid];
        // TODO : change baseurl from config
        url = `${config.get(
          "Geoserver"
        )}/Jeru/wms?&LAYERS=${restid}&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=${restid}&legend_options=countMatched:false;fontAntiAliasing:true;hideEmptyRules:false;forceLabels:on`;
      }
    }
    console.log("props.Layers", props.Layers);
    return url ? (
      props.global ? (
        <React.Fragment>
          <Accordion>
            <Accordion.Title active={active} onClick={() => toggle(!active)}>
              <Icon name="dropdown" />
              {name}
            </Accordion.Title>
            <Accordion.Content active={active}>
              <Checkbox toggle />
              <img src={url} />
            </Accordion.Content>
          </Accordion>
        </React.Fragment>
      ) : (
        <img src={url} />
      )
    ) : (
      <p>
        no legend for this layers OR technical issue on retrieving the legend
        object from the server
      </p>
    );
  };
  return <div>{renderLegendItem()}</div>;
};

const mapStateToProps = (state) => {
  return {
    Layers: selectCurrentMapLayers(state),
  };
};

export default connect(mapStateToProps)(LegendItem);
