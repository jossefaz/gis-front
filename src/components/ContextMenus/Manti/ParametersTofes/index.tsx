import React, { Component, useEffect, useState } from 'react';
import 'react-inputs-validation/lib/react-inputs-validation.min.css';
import './styles.css';
import Modal from '../Modal/Modal';
import CurrRowStringType from './CurrentRowStringType/CurrentRowStringType';
import CurrRowComboType from './CurrentRowComboType/CurrentRowComboType';
import CurrRowDatePickerType from './CurrentRowDatePickerType/CurrentRowDatePickerType';
import _ from 'lodash';
import { ParamTofes, MenuItem, UITypes } from '../types';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import inputRegistry from '../Inputs/Inputs';

interface Props {
  data: ParamTofes;
  toggleModal: () => void;
  identifyResult: any;
  findItemByName: (commandId: string, adaptorId: string, data: any) => void;
  localconfig: any;
  bankPkudotRow: MenuItem;
  commandApiAddress: string;
}

const ParametersTofesComponent: React.FC<Props> = (props) => {
  console.log(`props`, props);
  const [initialValues, setInitialValues] = useState<{ [key: string]: any }>(
    {}
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const renderField = () => {
    return props.data.map((config) => {
      const initVal =
        config.name in initialValues ? initialValues[config.name] : '';
      const inputConfig = {
        config,
        initVal,
        key: config.name,
        register,
        errors,
      };
      return inputRegistry(config.UItype, inputConfig);
    });
  };
  const onSubmit = async (formValues: any) => {
    props.toggleModal();
    const resultBody = {
      controlSystem: props.bankPkudotRow.AdaptorId,
      functionName: props.bankPkudotRow.Name,
      prms: formValues,
    };
    const apiAddress = props.localconfig.commandApiAddress;
    const { data } = await axios.post(apiAddress, JSON.stringify(resultBody), {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    if (data.ResultValue) {
      const template = JSON.parse(
        props.bankPkudotRow.templateComponent.replaceAll('\\"', '"')
      )[0];
      if (template) {
        const { commandId, adaptorId } = template;
        props.findItemByName(commandId, adaptorId, data.ResultValue);
      }
    }
  };

  useEffect(() => {
    const initialValue: { [key: string]: any } = {};
    props.data.map((paramConfig) => {
      const fieldName = paramConfig.value_source;
      if (fieldName && fieldName in props.identifyResult) {
        initialValue[paramConfig.name] = props.identifyResult[fieldName];
      }
    });
    setInitialValues(initialValue);
  }, []);

  return (
    <Modal
      isModalOpen={true}
      closeModal={props.toggleModal}
      afterOpen={() => {}}
    >
      <div
        style={{
          display: 'inline-flex',
        }}
      >
        <h4
          style={{
            color: 'red',
          }}
        >
          {props.bankPkudotRow.Name}
        </h4>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderField()}
        <input type="submit" />
      </form>
    </Modal>
  );
};

export default ParametersTofesComponent;
