import { FC, Fragment } from "react";
import { selectSelectedFeatures } from "../../../../../state/reducers";
import FeatureList from "../FeatureList";
import { Accordion } from "react-bootstrap";
import { useActions } from "../../../../../hooks/useActions";
import { useTypedSelector } from "../../../../../hooks/useTypedSelectors";

const LayersList: FC = () => {
  const selectedFeatures = useTypedSelector(selectSelectedFeatures);
  const { setCurrentFeatureLayer } = useActions();

  const renderSelectedFeature = () => {
    return selectedFeatures
      ? Object.keys(selectedFeatures).map((layer) => (
          <Fragment key={layer}>
            <Accordion.Toggle
              as="div"
              eventKey={layer}
              className="py-2 border-bottom px-tool"
            >
              + {selectedFeatures[layer][0].parentlayerProperties.layerAlias}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={layer}>
              <div className="py-3">
                <FeatureList selectedLayer={layer} />
              </div>
            </Accordion.Collapse>
          </Fragment>
        ))
      : null;
  };
  return (
    <Fragment>
      <div className="text-primary font-weight-bold px-tool py-3 border-bottom">
        זיהוי יישויות
      </div>
      <Accordion
        onSelect={(layer) => layer && setCurrentFeatureLayer(layer)}
        className="layers-groups"
      >
        {renderSelectedFeature()}
      </Accordion>
    </Fragment>
  );
};

export default LayersList;
