import _ from 'lodash';
import ParametersTofes from './ParametersTofes';
import MTCS_CpsParametersTofes from './MTCS_CpsParametersTofes';
import axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react';
import './style.css';
import {
  MenuItem,
  IdentifyResult,
  MenuConfig,
  ParamTofes,
  Parameter,
} from './types';

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

  const buildParamerter = (paramObj: any): Parameter => {
    const item: Parameter = {
      ...(paramObj['combo source'] && {
        combo_source: paramObj['combo source'],
      }),
      ...(paramObj['value source'] && {
        value_source: paramObj['value source'],
      }),
      ...(paramObj['helper function'] && {
        helper_function: paramObj['helper function'],
      }),
      ...(paramObj.UIType && { UItype: paramObj.UIType }),
      ...(paramObj.rule && { rule: paramObj.rule }),
      name: paramObj.name,
      type: paramObj.type,
      mandatory: paramObj.mandatory,
    };
    return item;
  };

  const parseParams = () => {
    const copy: any = pkudaData ? JSON.parse(pkudaData.Parameters) : false;
    if (copy) {
      return copy.map((paramItem: any) => buildParamerter(paramItem));
    }
    return copy;
  };

  const renderModal = () => {
    const params = parseParams();
    return genericItem && params && pkudaData ? (
      <ParametersTofes
        toggleModal={toggleModal}
        findItemByName={findItemByName}
        data={params}
        localconfig={props.local_config}
        bankPkudotRow={pkudaData}
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
          identifyResult={identifyResult ? identifyResult : {}}
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
    setmodalVisible(true);
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
    const isUniqueCategory = adaptors.length === 1;

    return adaptors.map((adaptor) => (
      <li key={adaptor}>
        {!isUniqueCategory && (
          <span onClick={() => toogleCategory(adaptor)} className="collapsible">
            {adaptor}
          </span>
        )}

        <ul
          className={`${
            isUniqueCategory
              ? 'active'
              : activeCategory.includes(adaptor)
              ? 'active'
              : 'nested'
          }`}
        >
          {getFilteredItems(adaptor).map((MenuItem) => (
            <li
              className="MenuItem"
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
