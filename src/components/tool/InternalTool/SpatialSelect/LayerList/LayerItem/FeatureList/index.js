import React, { useState } from "react";
import { List } from "semantic-ui-react";
import FeatureItem from "./FeatureItem";
const CheckboxExampleCheckbox = ({
  featuresArray,
  removeFeature,
  layerStyle,
}) => {
  const renderFeatures = () => (
    <List>
      {featuresArray.map((feature, index) => (
        <List.Item key={feature.getId()}>
          <FeatureItem
            feature={feature}
            style={layerStyle}
            removeFeature={removeFeature}
          />
        </List.Item>
      ))}
    </List>
  );

  return renderFeatures();
};

export default CheckboxExampleCheckbox;
