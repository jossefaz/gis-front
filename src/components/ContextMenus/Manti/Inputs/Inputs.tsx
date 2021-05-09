import React from "react";
import { Parameter } from "../types";

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
    <div style={{ color: "red" }}>
      {errors[config.name]?.type === "required" && `${config.name} is required`}
    </div>
  </React.Fragment>
);
