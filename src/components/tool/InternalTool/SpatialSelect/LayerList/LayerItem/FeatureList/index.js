import { List } from "semantic-ui-react";
import FeatureItem from "./FeatureItem";
const CheckboxExampleCheckbox = ({
  currentlayerSource,
  removeFeature,
  layerStyle,
}) => {
  const renderFeatures = () => (
    <List>
      {currentlayerSource.getFeatures().map((feature, index) => (
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
