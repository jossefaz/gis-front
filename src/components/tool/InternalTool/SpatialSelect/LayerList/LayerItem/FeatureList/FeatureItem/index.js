import React, { useState } from "react";
import { Checkbox } from "semantic-ui-react";
import IconButton from "../../../../../../../UI/Buttons/IconButton";
import Confirm from "../../../../../../../UI/Modal/Confirm";
import styles from "../../../../../../../../core/mapStyle";
import API from "../../../../../../../../core/api";

const { zoomTo, highlightFeature, unhighlightFeature } = API.features;

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
    unhighlightFeature();
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
        <IconButton
          className="ui icon button primary pointer margin05em"
          onClick={() => zoomTo(feature.getGeometry())}
          onHover={() => {
            highlightFeature(feature.getGeometry());
          }}
          icon="crosshairs"
          size="1x"
        />
      </div>

      <Confirm
        isOpen={Modal}
        confirmTxt={erasefeature.content}
        cancelBtnTxt={erasefeature.cancelBtn}
        confirmBtnTxt={erasefeature.confirmBtn}
        onCancel={() => setModal(false)}
        onConfirm={removeLocalFeature}
      />
    </React.Fragment>
  );
};

export default FeatureItem;
