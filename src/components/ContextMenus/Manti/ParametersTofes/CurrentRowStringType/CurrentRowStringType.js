import React from "react";
import { Textbox } from "react-inputs-validation";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import "../styles.css";
import { Button, Modal, Input, Tooltip, Form } from "antd";
import { QuestionCircleTwoTone } from "@ant-design/icons";
import FormItem from "antd/lib/form/FormItem";

export default class CurrRowStringType extends React.Component {
  constructor(props) {
    super(props);
  }
  numRow = null;
  stringRow = null;
  state = {
    visible: false,
    type: "",
    name: "",
    helperfunc: null,
    identresult: "",
    rule: "",
    validate: this.props.mandatory,
    value: "",
    mandatory: "",
    isModalVisible: false,
  };
  paramType = this.props.type;

  hf_setStringToField(formRecord, fieldName, cb) {
    // TODO: do something with the json and the mapid (for example)
    // var src = JSON.parse(formRecord.identresult);
    // var srcVal = null;
    // for (var a in src) {
    //   if (a === fieldName) {
    //     srcVal = src[a];
    //   }
    // }
    // this.setState({ value: srcVal });
    // if (typeof cb === "function") {
    //   cb.apply(null, [fieldName, srcVal]);
    // }
  }

  getId(idResults, cb) {
    if (idResults[this.props.name]) {
      this.setState({ value: idResults[this.props.name] });
      if (typeof cb === "function") {
        cb.apply(null, [this.props.name, idResults[this.props.name]]);
      }
    }
  }

  hf_calcAzimuthByPoint(formRecord, fieldName, cb) {
    // TODO: do something with the json and the map (for example)
    this[this.props.helperfunc](this.props.identresult, cb);
    // var src = formRecord.identresult;
    // var srcVal = null;
    // for (var a in src) {
    //   if (a === fieldName) {
    //     srcVal = src[a];
    //   }
    // }
    // this.setState({ value: srcVal });
    // if (typeof cb === "function") {
    //   cb.apply(null, [fieldName, srcVal]);
    // }
  }

  helperFunctionResultHandler(fieldName, newVal) {
    console.log(
      "setting value of [" + newVal + "] to field [" + fieldName + "]"
    );
  }
  render() {
    const rowStyle = {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: "2%",
      fontSize: "14px",
    };
    const rowWrapperStyle = {
      display: "table",
      width: "100%",
    };
    const rowContainerStyle = {
      display: "table-cell",
      verticalAlign: "middle",
      borderBottom: "1px solid #e5e5e5",
    };
    const labelStyle = {
      display: "inline-block",
    };
    const labelContentStyle = {
      verticalAlign: "middle",
    };
    var tempVal = 4;
    // var isModalVisible = true;
    var showModal = () => {
      this.setState({ isModalVisible: true });
    };

    const handleOk = (values) => {
      alert(
        "Pythagoras = " +
          Math.sqrt(tempVal * tempVal + this.state.value * this.state.value)
      );
      this.setState({ isModalVisible: false });
    };

    const handleCancel = () => {
      this.setState({ isModalVisible: false });
    };

    return (
      <div style={rowWrapperStyle}>
        <div style={rowContainerStyle}>
          <div style={rowStyle}>
            <div style={{ ...labelStyle, flex: "3 3 0px", marginTop: "3px" }}>
              <span
                className="icon icon-person"
                style={{ ...labelContentStyle, fontSize: "20px" }}
              />
              &nbsp;
              <span style={labelContentStyle}>{this.props.name}</span>
            </div>
            <div>
              {this.props.helperfunc ? (
                <div>
                  <Tooltip title={this.props.helperfunc}>
                    <Button
                      type="primary"
                      style={{ fontSize: "25px", height: "37px" }}
                      // shape="circle-outline"
                      icon={<QuestionCircleTwoTone />}
                      onClick={() => showModal()}
                    >
                      ?
                    </Button>
                  </Tooltip>

                  <Modal
                    width="400px"
                    title="20px to Top"
                    style={{ top: 20 }}
                    title="Basic Modal"
                    visible={this.state.isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okButtonProps={{ value: tempVal }}
                  >
                    <Form>
                      <FormItem>
                        <Input />
                      </FormItem>
                      <Form.Item>
                        <Button type="primary" onClick={handleOk}>
                          Submit
                        </Button>
                      </Form.Item>
                    </Form>
                  </Modal>
                </div>
              ) : null}
            </div>

            <div style={{ flex: "6 6 0px" }}>
              <Textbox
                attributesWrapper={{}}
                attributesInput={{
                  id: this.props.name,
                  name: this.props.name,
                  type: this.props.type === "string" ? "text" : this.props.type,
                  rule: this.props.rule,
                  helperfunc: this.props.helperfunc,
                  identresult: this.props.identifyResult,
                  placeholder: "Place your " + this.props.name + " here ",
                }}
                value={(() => {
                  console.log("value", this.state.value);
                  return Object.keys(this.props.identresult).includes(
                    this.props.valSource
                  ) && this.state.value === this.props.valSource
                    ? this.props.identresult[this.props.valSource]
                    : this.state.value;
                })()} // Optional.[String].Default: "".
                disabled={false} // Optional.[Bool].Default: false.
                validate={this.props.validate} // Optional.[Bool].Default: false. If you have a submit button and trying to validate all the inputs of your form at onece, toggle it to true, then it will validate the field and pass the result via the "validationCallback" you provide.
                // validationCallback={((res) => {
                //   console.log(this.props.mandatory);
                //   if (this.props.mandatory)
                //     this.setState({ validate: false });
                // })()}
                validationCallback={(res) => {
                  //   this.setState({ hasNameError: res, validate: false });
                  //   console.log(this.props.mandatory);
                }}
                // Optional.[Func].Default: none. Return the validation result.
                classNameInput="" // Optional.[String].Default: "".
                classNameWrapper="" // Optional.[String].Default: "".
                classNameContainer="" // Optional.[String].Default: "".
                customStyleInput={{}} // Optional.[Object].Default: {}.
                customStyleWrapper={{}} // Optional.[Object].Default: {}.
                customStyleContainer={{}} // Optional.[Object].Default: {}.
                onChange={(val, e) => {
                  const changedParam = {
                    name: this.props.name,
                    value: val,
                  };
                  this.setState(
                    { changedParam, value: val, validate: val ? false : true },
                    () => {
                      // console.log("state after setstate", this.state);
                      // console.log("props after setstate", this.props);
                      console.log(this.props.type);
                    }
                  );
                  // this.props.type === "number"
                  //   ? this.props.parentIntCallback(changedParam)
                  //   : this.props.type === "string"
                  //   ? this.props.parentStringCallback(changedParam)
                  //   : null;
                  var f = this.props.name;
                }} // Required.[Func].Default: () => {}. Will return the value.
                onBlur={(e) => {
                  console.log("type is " + this.props.type);
                  console.log(e);
                }} // Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
                // onFocus={(e) => {console.log(e);}} // Optional.[Func].Default: none.
                // onClick={(e) => {console.log(e);}} // Optional.[Func].Default: none.
                validationOption={{
                  //   reg: function () {
                  //     alert(this.props.rule)
                  //     return this.props.rule ? /^(?:[1-9]\d?|[12]\d{2}|3[0-5]\d|36[0-5])$/ : alert(this.props.rule);
                  // },
                  //  reg: this.props.rule ?  /^(?:[1-9]\d?|[12]\d{2}|3[0-5]\d|36[0-5])$/ : console.log(this.props.rule),
                  //  regMsg: this.props.rule + "  לא מתאים ל  "
                  //    ,
                  //   function () {
                  //     return "לא מתאים ל "; //+ {state.rule};
                  // },
                  name: "", // Optional.[String].Default: "". To display in the Error message. i.e Please enter your ${name}.
                  check: true, // Optional.[Bool].Default: true. To determin if you need to validate.
                  required: true, // Optional.[Bool].Default: true. To determin if it is a required field.
                  // type: 'string', // Optional.[String].Default: "string". Validation type, options are ['string', 'number', 'alphanumeric', 'alpha'].
                  // showMsg: true, // Optional.[Bool].Default: true. To determin display the error message or not.
                  // min: 2, // Optional.[Number].Default: 0. Validation of min length when validationOption['type'] is string, min amount when validationOption['type'] is number.
                  // max: 10, // Optional.[Number].Default: 0. Validation of max length when validationOption['type'] is string, max amount when validationOption['type'] is number.
                  // length: 2, // Optional.[Number].Default: 0. Validation of exact length of the value.
                  // compare: '3', // Optional.[String].Default: "" Compare this value to 3 to see if they are equal.
                  // reg: /^\d{18}|\d{15}$/, // Optional.[Bool].Default: "" Custom regex.
                  // regMsg: 'failed in reg.test(${value})', // Optional.[String].Default: "" Custom regex error message.
                  // locale: 'en-US', // Optional.[String].Default: "en-US". For error message display. Current options are ['zh-CN', 'en-US']; Default is 'en-US'.
                  // msgOnError: "Your custom error message if you provide the validationOption['msgOnError']", // Optional.[String].Default: "" Show your custom error message no matter what when it has error if it is provied.
                  // msgOnSuccess: "Your custom success message if you provide the validationOption['msgOnSuccess']. Otherwise, it will not show, not even green border." // Optional.[String].Default: "". Show your custom success message no matter what when it has error if it is provied.
                  // customFunc: res => { // Optional.[Func].Default: none. Custom function. Returns true or err message
                  //   if (res != 'milk') {
                  //     return 'Name cannot be other things but milk';
                  //   }
                  //   return true;
                  // }

                  customFunc: (res) => {
                    var result = true;
                    //Optional.[Func].Default: none. Custom function. Returns true or err message
                    if (res === "") {
                      this.setState({ hasError: true });
                      return "יש למלא ערך";
                    }
                    if (res && this.props.rule) {
                      var expr = "var x=" + res + "; " + this.props.rule;
                      try {
                        if (eval(expr)) {
                          this.setState({ hasError: false });
                          result = true;
                          return result;
                        } else {
                          return this.props.rule + "לא מתאים ל  ";
                        }
                      } catch (error) {
                        return " ביטוי לא חוקי[" + this.props.rule + "]";
                      }
                    }
                    this.setState({ hasError: false });
                    return result;
                  },
                }}
              />
              {this.state.validate && (
                <p style={{ color: "red", fontSize: "12px" }}>{"שדה חובה"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
