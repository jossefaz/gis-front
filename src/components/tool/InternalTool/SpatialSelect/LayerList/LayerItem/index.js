import React, { useState } from "react";
import { Checkbox } from "semantic-ui-react";
import VectorLayerRegistry from "../../../../../../utils/vectorlayers";
import IconButton from "../../../../../UI/Buttons/IconButton";
import { Confirm } from "semantic-ui-react";
const LayerItem = ({ uuid, index, removeLayer }) => {
  const [Checked, setChecked] = useState(true);
  const [Modal, setModal] = useState(false);

  const eraselayer = {
    content: "? האם באמת למחוק את היישות",
    confirmBtn: "כן",
    cancelBtn: "לא",
  };
  const toggleLayer = () => {
    const registry = VectorLayerRegistry.getInstance();
    registry.getVectorLayer(uuid)._toggleVisibility();
    setChecked(!Checked);
  };

  const removeLocalLayer = () => {
    removeLayer(uuid);
    setModal(false);
  };

  return (
    <React.Fragment>
      <Checkbox
        key={uuid}
        value={uuid}
        label={`selection ${index}`}
        onChange={toggleLayer}
        checked={Checked}
      />
      <IconButton
        className={`ui icon button pointer negative`}
        onClick={() => setModal(true)}
        icon="trash-alt"
        size="xs"
      />
      <Confirm
        open={Modal}
        size="mini"
        content={eraselayer.content}
        cancelButton={eraselayer.cancelBtn}
        confirmButton={eraselayer.confirmBtn}
        onCancel={() => setModal(false)}
        onConfirm={removeLocalLayer}
      />
    </React.Fragment>
  );
};

export default LayerItem;
