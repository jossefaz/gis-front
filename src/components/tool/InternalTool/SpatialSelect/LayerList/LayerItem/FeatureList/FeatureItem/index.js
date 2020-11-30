import React, { useState } from "react";
import { Checkbox } from "semantic-ui-react";
import VectorLayerRegistry from "../../../../../../../../utils/vectorlayers";
import IconButton from "../../../../../../../UI/Buttons/IconButton";
import { Confirm } from "semantic-ui-react";
import styles from "../../../../../../../../nessMapping/mapStyle";
import { getFeatureProperties } from "../../../../../../../../nessMapping/api";

const FeatureItem = ({ feature, style, removeFeature }) => {
  const [Checked, setChecked] = useState(true);
  const [Modal, setModal] = useState(false);
  const erasefeature = {
    content: "? האם באמת למחוק את היישות",
    confirmBtn: "כן",
    cancelBtn: "לא",
  };
  const toggleFeature = () => {
    if (Checked) {
      feature.setStyle(styles.HIDDEN);
    } else {
      feature.setStyle(style);
    }
    setChecked(!Checked);
  };

  const removeLocalFeature = () => {
    feature.setStyle(styles.HIDDEN);
    removeFeature(feature);
    setModal(false);
  };

  return (
    <React.Fragment>
      <div className="displayFlex">
        <Checkbox
          label={feature.getId()}
          onChange={toggleFeature}
          checked={Checked}
        />
        <IconButton
          className={`ui icon button pointer negative`}
          onClick={() => setModal(true)}
          icon="trash-alt"
          size="xs"
        />
      </div>

      <Confirm
        open={Modal}
        size="mini"
        content={erasefeature.content}
        cancelButton={erasefeature.cancelBtn}
        confirmButton={erasefeature.confirmBtn}
        onCancel={() => setModal(false)}
        onConfirm={removeLocalFeature}
      />
    </React.Fragment>
  );
};

export default FeatureItem;
