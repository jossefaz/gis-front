import React, { useState } from "react";
import Tofes from "./ParametersTofes";
import API from "../../../core/api";
const { getFocusedMapUUID } = API.map;
export default ({ menu_config, local_config, feature }) => {
  const [open, setopen] = useState(false);
  const [item, setItem] = useState(null);

  const openComp = (item) => {
    setopen(!open);
    item && setItem(item);
  };

  const getComp = () => {
    console.log("param", {
      local_config,
      feature,
      toggleModal: open,
      data: item.Parameters,
      mapId: getFocusedMapUUID(),
      bankPkudotRow: item,
      identifyResult: feature.properties,
    });
    return (
      <Tofes
        local_config={local_config}
        feature={feature}
        toggleModal={openComp}
        data={{
          value: item.Parameters,
        }}
        bankPkudotRow={item}
        mapId={getFocusedMapUUID()}
        identifyResult={feature.properties}
      />
    );
  };

  return (
    <div style={{ display: "grid" }}>
      {menu_config.map((item) => (
        <button key={item.ID} onClick={() => openComp(item)}>
          {item.Name}
        </button>
      ))}
      {open && (
        <Tofes
          local_config={local_config}
          feature={feature}
          toggleModal={openComp}
          data={{
            value: item.Parameters,
          }}
          bankPkudotRow={item}
          mapId={getFocusedMapUUID()}
          identifyResult={feature.properties}
        />
      )}
    </div>
  );
};
