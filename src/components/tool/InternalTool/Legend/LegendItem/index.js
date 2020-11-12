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
import { Accordion, Icon } from "semantic-ui-react";
import { getHeight, getWidth } from "ol/extent";
import { Checkbox } from "semantic-ui-react";
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
    let url;
    let name;
    if (layer) {
      const baseurl = layer.getSource().getLegendUrl();
      const crs = `&CRS=${getCurrentProjection().getCode()}`;
      const cql = `&BBOX=${getCurrentExtent().join(",")}`;
      const heightAndWidth = `&srcwidth=${getHeight(
        getCurrentExtent()
      )}&srcheight=${getWidth(getCurrentExtent())}`;
      name = layer.getSource().getParams().LAYERS.split(":")[1];
      url = `${baseurl}${cql}${crs}${heightAndWidth}&legend_options=countMatched:true;fontAntiAliasing:true;hideEmptyRules:true;forceLabels:on`;
    }
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
    Layers: state.Layers,
  };
};

export default connect(mapStateToProps)(LegendItem);
