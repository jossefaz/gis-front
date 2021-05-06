import _ from "lodash";
import ParametersTofes from "./ParametersTofes";
import MTCS_CpsParametersTofes from "./MTCS_CpsParametersTofes";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import "./style.css";
import { MenuItem, IdentifyResult, MenuConfig } from "./types";

interface Props {
  menu_config: MenuConfig[];
  local_config: { [key: string]: any };
  feature: IdentifyResult;
}

const BankPkudotTree: React.FC<Props> = (props) => {
  const [modalVisible, setmodalVisible] = useState<boolean>(false);
  const [genericItem, setgenericItem] = useState<boolean>(true);
  const [pkudaData, setpkudaData] = useState<MenuItem | null>(null);
  const [identifyResult, setidentifyResult] = useState<IdentifyResult | null>();
  const [activeCategory, setactiveCategory] = useState<string[]>([]);

  const toggleModal = () => setmodalVisible(!modalVisible);

  const fetchPkuda = async (itemId: number) => {
    const { data } = await axios.get<MenuItem>(
      props.local_config.pkudatItemByIdAddress + itemId
    );
    setpkudaData(data);
    setmodalVisible(true);
  };

  const renderModal = () => {
    return genericItem && pkudaData ? (
      <ParametersTofes
        toggleModal={toggleModal}
        findItemByName={findItemByName}
        data={{ value: pkudaData.Parameters }}
        localconfig={props.local_config}
        bankPkudotRow={pkudaData}
        mapId={222}
        identifyResult={identifyResult ? identifyResult.properties : {}}
        commandApiAddress={props.local_config.commandApiAddress}
      />
    ) : (
      pkudaData && (
        <MTCS_CpsParametersTofes
          toggleModal={toggleModal}
          findItemByName={findItemByName}
          data={(() => {
            return { value: pkudaData.Parameters };
          })()}
          localconfig={props.local_config}
          bankPkudotRow={pkudaData}
          mapId={222}
          identifyResult={identifyResult ? identifyResult.properties : {}}
          commandApiAddress={props.local_config.commandApiAddress}
        />
      )
    );
  };

  const findItemByName = (commandId: string, adaptorId: string, data: any) => {
    const itByAdaptor = props.menu_config[0].filter(
      (item) => item.AdaptorId == adaptorId
    );
    const itByName = itByAdaptor.filter((i) => i.Name == commandId);
    setidentifyResult(data);
    setgenericItem(false);
    setpkudaData(itByName[0]);
    toggleModal();
  };

  const toogleCategory = (category: string) => {
    let cat_copy = [...activeCategory];
    const index = cat_copy.indexOf(category);
    if (index !== -1) {
      cat_copy.splice(index, 1);
    } else {
      cat_copy.push(category);
    }
    setactiveCategory(cat_copy);
  };

  const getFilteredItems = (adaptor: string) =>
    props.menu_config[0].filter((mi) => mi.AdaptorId == adaptor);

  const renderTree = () => {
    const adaptors = [
      ...new Set(props.menu_config[0].map((MenuItem) => MenuItem.AdaptorId)),
    ];

    return adaptors.map((adaptor) => (
      <li key={adaptor}>
        <span
          onClick={() => toogleCategory(adaptor)}
          className={`${
            activeCategory.includes(adaptor) ? "caret-down" : "caret"
          }`}
        >
          {adaptor}
        </span>
        <ul
          className={`${
            activeCategory.includes(adaptor) ? "active" : "nested"
          }`}
        >
          {getFilteredItems(adaptor).map((MenuItem) => (
            <li
              key={MenuItem.ID}
              onClick={async () => {
                await fetchPkuda(MenuItem.ID);
              }}
            >
              {MenuItem.Name}
            </li>
          ))}
        </ul>
      </li>
    ));
  };

  useEffect(() => {
    debugger;
    setidentifyResult(props.feature);
  }, []);
  return (
    <React.Fragment>
      <ul>{renderTree()}</ul>
      {modalVisible && pkudaData && renderModal()}
    </React.Fragment>
  );
};

export default BankPkudotTree;
