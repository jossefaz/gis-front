import { divide } from "lodash";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Message } from "semantic-ui-react";
import _ from "lodash";
import "./style.css";
import IconButton from "../Buttons/IconButton";

const bannedFields = ["geometry", "geom"];
export default (props) => {
  const { register, handleSubmit, errors, setValue } = useForm();
  const [config, setConfig] = useState(props.config);
  const [values, setValues] = useState(props.values);
  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
      mounted.current = true;
    } else {
      // do componentDidUpdate logic
      if (!_.isEqual(values, props.values)) {
        setValues(props.values);
        config.map((fieldConf) =>
          setValue(fieldConf.name, props.values[fieldConf.name])
        );
      }
    }
  });
  return (
    <div className="uirtl login-box">
      <form onSubmit={handleSubmit(props.onSubmit)}>
        {config.map(
          (fieldConf) =>
            !bannedFields.includes(fieldConf.name) && (
              <div key={fieldConf.name} className="user-box">
                <input
                  name={fieldConf.name}
                  ref={register}
                  defaultValue={values && values[fieldConf.name]}
                />
                <label>{fieldConf.name}</label>
              </div>
            )
        )}
        <IconButton
          className={`ui icon button pointer positive`}
          icon="save"
          size="lg"
        />
      </form>
      <div className="optionalButtons">
        {props.optionalButton && props.optionalButton()}
      </div>
    </div>
  );
};
