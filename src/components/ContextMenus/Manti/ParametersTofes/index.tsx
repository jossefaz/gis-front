import React, { Component, useEffect, useState } from "react";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import "./styles.css";
import Modal from "../Modal/Modal";
import CurrRowStringType from "./CurrentRowStringType/CurrentRowStringType";
import CurrRowComboType from "./CurrentRowComboType/CurrentRowComboType";
import CurrRowDatePickerType from "./CurrentRowDatePickerType/CurrentRowDatePickerType";
import _ from "lodash";
import { ParamTofes, MenuItem, UITypes } from "../types";
import { useForm } from "react-hook-form";
import axios from "axios";
import { TextInput } from "../Inputs/Inputs";

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
    watch,
    formState: { errors },
  } = useForm();

  const renderField = () => {
    return props.data.map((paramConfig) => {
      const initalValue =
        paramConfig.name in initialValues
          ? initialValues[paramConfig.name]
          : "";
      switch (paramConfig.UItype) {
        case UITypes.string:
          return (
            <TextInput
              config={paramConfig}
              initVal={initalValue}
              key={paramConfig.name}
              register={register}
              errors={errors}
            />
          );
        case UITypes.date:
          return (
            <input
              key={paramConfig.name}
              type="date"
              defaultValue={initalValue}
              {...register(paramConfig.name)}
            />
          );
        default:
          return (
            <TextInput
              config={paramConfig}
              initVal={initalValue}
              key={paramConfig.name}
              register={register}
              errors={errors}
            />
          );
      }
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
        "Content-type": "application/json; charset=UTF-8",
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
          display: "inline-flex",
        }}
      >
        <h4
          style={{
            color: "red",
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

  //   this.state = {
  //     bankPkudotRow: null,
  //     mapId: null,
  //     identifyResult: null,
  //     name: "",
  //     number: "",
  //     validate: true,
  //     visible: false,
  //     rows: [],
  //     data: "",

  // handleOk = (e) => {
  //   // if (this.bankPkudRow.ID != 56 && this.bankPkudRow.ID != 78) {
  //   //   alert("לא ניתן לשלוח את הפקודה");
  //   //   return;
  //   // }
  //   debugger;
  //   var errors = null;

  //   var schData = JSON.parse(this.props.data.value);
  //   var resData = this.state.rows;

  //   errors = this.validateTofes(schData, resData);
  //   var errorString = "";
  //   errors.forEach((str) => {
  //     errorString += str + ",";
  //   });
  //   errorString = errorString.slice(0, -1);
  //   if (errors.length > 0) {
  //     alert("שי למלא " + errorString);
  //     return;
  //   }

  //   console.log(this.state.rows);
  //   if (errors.length === 0) {
  //     var mapped = resData.map((item) => ({
  //       [item.name]: item.value,
  //     }));

  //     var resPrms = Object.assign({}, ...mapped);
  //     console.log(resPrms);
  //     var resultBody = {
  //       controlSystem: this.bankPkudRow.AdaptorId,
  //       functionName: this.bankPkudRow.Name,
  //       prms: resPrms,
  //     };
  //     const postMethod = {
  //       method: "POST",
  //       headers: {
  //         "Content-type": "application/json; charset=UTF-8", // Indicates the content
  //       },

  //       body: JSON.stringify(resultBody),
  //     };

  //     var
  //     fetch(apiAddress, postMethod)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // alert("פקודה נשלחה");
  //         if (data.ResultCode <= 0) {
  //           alert(data.ResultMessage);
  //           return;
  //         }
  //         const template = JSON.parse(
  //           this.props.bankPkudotRow.templateComponent.replaceAll('\\"', '"')
  //         )[0];
  //         if (template) {
  //           const { commandId, adaptorId } = template;
  //           this.props.findItemByName(commandId, adaptorId, data.ResultValue);
  //         }
  //       })
  //       .catch((err) => {
  //         console.log("pkuda send response error", err);
  //         //alert("פקודה לא נשלחה" + err);
  //       });
  //     this.props.toggleModal(); // open non generic form
  //   }
  // };

  // validateTofes(schema, resultData) {
  //   var error = [];

  //   schema.forEach((row) => {
  //     if (row.mandatory || row.mandatory == "true") {
  //       if (
  //         resultData.length === 0 ||
  //         !resultData.some((e) => e.name === row.name) ||
  //         !resultData.some((e) => e.value)
  //       ) {
  //         error.push(row.name);
  //       } else {
  //       }
  //     } else {
  //     }
  //   });

  //   return error;
  // }

  // handleCancel = (e) => {
  //   console.log(e);
  //   this.props.toggleModal();
  // };

  // componentDidMount() {
  //   this.setInitialValuesFromIdentifyResult();
  // }

  // render() {
  //   this.paramsData = JSON.parse(this.props.data.value);
  //   this.bankPkudRow = this.props.bankPkudotRow;
  //   this.identifyResult = this.props.identifyResult;
  //   return (
  //     <Modal isModalOpen={true} closeModal={this.props.toggleModal}>
  //       <div
  //         style={{
  //           display: "inline-flex",
  //         }}
  //       >
  //         <h4
  //           style={{
  //             color: "red",
  //           }}
  //         >
  //           {this.bankPkudRow.Name}
  //         </h4>
  //       </div>
  //       <form>
  //         {this.paramsData &&
  //           this.paramsData.map((row, index) =>
  //             row.UItype === "string" ? (
  //               <CurrRowStringType
  //                 parentStringCallback={this.callbackStringFunction}
  //                 key={this.paramsData[index]["name"]}
  //                 name={this.paramsData[index]["name"]}
  //                 type={this.paramsData[index]["UItype"]}
  //                 rule={this.paramsData[index]["rule"]}
  //                 helperfunc={this.paramsData[index]["helper function"]}
  //                 identresult={this.props.identifyResult}
  //                 valSource={this.paramsData[index]["value source"]}
  //                 mandatory={this.paramsData[index]["mandatory"]}
  //                 localconfig={this.props.localconfig}
  //               />
  //             ) : row.UItype === "combo" ? (
  //               <CurrRowComboType
  //                 parentComboCallback={this.callbackComboFunction}
  //                 key={this.paramsData[index]["name"]}
  //                 name={this.paramsData[index]["name"]}
  //                 type={this.paramsData[index]["UItype"]}
  //                 rule={this.paramsData[index]["rule"]}
  //                 helperfunc={this.paramsData[index]["helper function"]}
  //                 identresult={this.props.identifyResult}
  //                 valSource={this.paramsData[index]["value source"]}
  //                 comboSource={this.paramsData[index]["combo source"]}
  //                 mandatory={this.paramsData[index]["mandatory"]}
  //                 localconfig={this.props.localconfig}
  //               />
  //             ) : row.UItype === "date" ? (
  //               <CurrRowDatePickerType
  //                 parentDateCallback={this.callbackDateFunction}
  //                 key={this.paramsData[index]["name"]}
  //                 name={this.paramsData[index]["name"]}
  //                 type={this.paramsData[index]["UItype"]}
  //                 rule={this.paramsData[index]["rule"]}
  //                 helperfunc={this.paramsData[index]["helper function"]}
  //                 identresult={this.props.identifyResult}
  //                 valSource={this.paramsData[index]["value source"]}
  //                 mandatory={this.paramsData[index]["mandatory"]}
  //                 localconfig={this.props.localconfig}
  //               />
  //             ) : (
  //               <CurrRowStringType
  //                 parentIntCallback={this.callbackIntFunction}
  //                 key={this.paramsData[index]["name"]}
  //                 name={this.paramsData[index]["name"]}
  //                 type={this.paramsData[index]["UItype"]}
  //                 rule={this.paramsData[index]["rule"]}
  //                 helperfunc={this.paramsData[index]["helper function"]}
  //                 identresult={this.props.identifyResult}
  //                 valSource={this.paramsData[index]["value source"]}
  //                 mandatory={this.paramsData[index]["mandatory"]}
  //                 localconfig={this.props.localconfig}
  //               />
  //             )
  //           )}
  //         <div>
  //           <button
  //             onClick={(e) => {
  //               this.handleCancel(e);
  //             }}
  //           >
  //             Close
  //           </button>
  //           <button
  //             onClick={(e) => {
  //               this.handleOk(e);
  //             }}
  //           >
  //             OK
  //           </button>
  //         </div>
  //       </form>
  //     </Modal>
  //   );
};

export default ParametersTofesComponent;
