import React, { lazy } from 'react';
import { Parameter, UITypes } from '../types';

interface Props {
  key: any;
  initVal: any;
  register: any;
  config: Parameter;
  errors: any;
}

export const TextInput: React.FC<Props> = ({
  config,
  initVal,
  register,
  key,
  errors,
}) => (
  <React.Fragment>
    <label htmlFor={config.name}>{config.name}</label>
    <input
      key={key}
      type="text"
      defaultValue={initVal}
      {...register(config.name, { required: config.mandatory })}
    />
    <div style={{ color: 'red' }}>
      {errors[config.name]?.type === 'required' && `${config.name} is required`}
    </div>
  </React.Fragment>
);

export const NumberInput: React.FC<Props> = ({
  config,
  initVal,
  register,
  key,
  errors,
}) => (
  <React.Fragment>
    <label htmlFor={config.name}>{config.name}</label>
    <input
      key={key}
      type="number"
      defaultValue={initVal}
      {...register(config.name, { required: config.mandatory })}
    />
    <div style={{ color: 'red' }}>
      {errors[config.name]?.type === 'required' && `${config.name} is required`}
    </div>
  </React.Fragment>
);

export const REGISTRY = (uiTypes: UITypes, props: Props) => {
  const reg = {
    [UITypes.number]: <NumberInput {...props} />,
    [UITypes.string]: <TextInput {...props} />,
    [UITypes.combo]: <TextInput {...props} />,
    [UITypes.date]: <TextInput {...props} />,
  };
  return uiTypes in reg ? reg[uiTypes] : <TextInput {...props} />;
};
export default REGISTRY;
