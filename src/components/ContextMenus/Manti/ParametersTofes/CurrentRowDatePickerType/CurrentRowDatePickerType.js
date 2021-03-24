import React from "react";
import { DatePicker } from "antd";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import "../styles.css";
import { Button, Modal, Input, Icon, Tooltip, Form } from "antd";
import { QuestionCircleTwoTone } from "@ant-design/icons";

export default class CurrRowDatePickerType extends React.Component {
  state = {
    visible: false,
    type: "",
    name: "",
    helperfunc: "",
    identresult: "",
    rule: "",
    validate: this.props.mandatory,
    camera: "",
    date: new Date(),
    mandatory: "",
  };
  paramType = this.props.type;

  getId(idResults) {
    alert(this.props.helperfunc);
  }

  evalHelperFunction() {
    this[this.props.helperfunc](this.props.identresult);
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
    return (
      <div style={rowWrapperStyle}>
        <div style={rowContainerStyle}>
          <div style={rowStyle}>
            <div style={{ ...labelStyle, flex: "3 3 0px", marginTop: "3px" }}>
              <span
                className="icon icon-bookmark"
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
                      onClick={() => this.evalHelperFunction()}
                    >
                      ?
                    </Button>
                  </Tooltip>
                </div>
              ) : null}
            </div>
            <div style={{ flex: "6 6 0px", height: "39px" }}>
              <DatePicker
                //he_IL

                onChange={(res, e) => {
                  var formatedValue = res.format("DD/MM/YYYY");
                  const changedParam = {
                    name: this.props.name,
                    value: formatedValue,
                  };

                  // this.setState({ row: this.row });
                  if (res) {
                    this.setState({
                      row: changedParam,
                      value: formatedValue,
                      validate: res ? false : true,
                    });
                    this.props.parentDateCallback(changedParam);
                    this.state.validate = this.props.mandatory;
                  }
                }}
                validate={this.props.validate}
                validationOption={{
                  name: this.props.name, // Optional.[String].Default: "". To display in the Error message. i.e Please select a ${name}.
                  check: true, // Optional.[Bool].Default: true. To determin if you need to validate.
                  required: true, // Optional.[Bool].Default: true. To determin if it is a required field.
                  // showMsg: true, // Optional.[Bool].Default: true. To determin display the error message or not.
                  // locale: 'en-US', // Optional.[String].Default: "en-US". For error message display. Current options are ['zh-CN', 'en-US']; Default is 'en-US'.
                  // msgOnError: "Your custom error message if you provide the validationOption['msgOnError']", // Optional.[String].Default: "". Show your custom error message no matter what when it has error if it is provied.
                  // msgOnSuccess: "Your custom success message if you provide the validationOption['msgOnSuccess']. Otherwise, it will not show, not even green border." // Optional.[String].Default: "". Show your custom success message no matter what when it has error if it is provied.
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
