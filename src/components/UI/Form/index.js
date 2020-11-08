import { divide } from "lodash";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Message } from "semantic-ui-react";
import "./style.css";

const bannedFields = ["geometry"];
export default (props) => {
  const { register, handleSubmit, errors } = useForm();
  const [config, setConfig] = useState(props.config);

  return (
    <div id={props.formId} className="uirtl login-box">
      <form onSubmit={handleSubmit(props.onSubmit)}>
        {config.map(
          (fieldConf) =>
            !bannedFields.includes(fieldConf.name) && (
              <div key={fieldConf.name} className="user-box">
                <input name={fieldConf.name} ref={register} />
                <label>{fieldConf.name}</label>
              </div>
            )
        )}
        <input type="submit" />
      </form>
    </div>
  );
};
