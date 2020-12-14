import ColumnGroup from "antd/lib/table/ColumnGroup";
import React, { Component } from "react";
import config from "react-global-configuration";
import { Select } from "react-inputs-validation";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import axios from "axios";
import "../styles.css";
import _ from "lodash";
import { Button, Tooltip } from "antd";
import { QuestionCircleTwoTone } from "@ant-design/icons";

export default class CurrRowComboType extends React.Component {
  state = {
    visible: false,
    type: "",
    name: "",
    helperfunc: "",
    identresult: "",
    validate: this.props.mandatory,
    rule: "",
    value: "",
    comboSrc: [],
    comboSourceArray: [],
    mandatory: "",
  };
  paramType = this.props.type;

  initCombobox = (itemArray) => {
    var cArray = [];
    for (var k in itemArray) {
      var item = {};
      item.id = `${itemArray[k].code}`;
      item.name = itemArray[k].descr;
      cArray.push(item);
    }
    this.setState({ comboSrc: cArray });
    let val = "";
    if (Object.keys(this.props.identresult).includes(this.props.valSource)) {
      val = this.props.identresult[this.props.valSource];
      var obj = cArray.find((element) => element.id === val);
      this.setState({ value: val, validate: false });
    }
  };

  fetchData = async () => {
    debugger;
    var mockUpapiAddress = this.props.local_config["mockUpApiAddress"];
    var cmbSourceArray = JSON.parse(this.props.comboSource);
    var reqUrlCombo =
      // "http://meitarimds:5002/api/MockupData/byName?name=" +
      mockUpapiAddress +
      cmbSourceArray.name +
      "&filter=" +
      cmbSourceArray.filter +
      "&limit=" +
      cmbSourceArray.limit +
      "&outparams=" +
      cmbSourceArray.outparams.split(",")[0] +
      "," +
      cmbSourceArray.outparams.split(",")[1];

    // var reqUrlCombo =
    //   "http://localhost:5002/api/MockupData/byName?name=combogenerator&filter=cameras&limit=3&outparams=code,descr";
    const resCombo = await axios.get(reqUrlCombo);
    this.initCombobox(resCombo.data);
  };

  componentDidMount() {
    console.log("props", this.props);
    console.log("state", this.state);

    if (this.props.comboSource != "") {
      var cmbSrc = JSON.parse(this.props.comboSource);
      if (cmbSrc.type === "internal") {
        //{"address": [ { "code": "ON", "descr":"הדלקת שלטים"} ,{ "code":"OFF", "descr":"כיבוי שלטים"} ],"type":"internal"}
        this.initCombobox(cmbSrc.address);
      } else {
        this.fetchData();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("nextState", nextState);
    return true;
  }

  getId(idResults) {
    var fldName = this.props.name;
    alert(this.props.helperfunc + " " + idResults[fldName]);
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
            <div style={{ flex: "6 6 0px" }}>
              <Select
                attributesWrapper={{}}
                attributesInput={{
                  id: this.props.name,
                  name: this.props.name,
                  value: this.props.value,
                  rule: this.props.rule,
                  combosource: this.props.comboSource,
                  helperfunc: this.props.helperfunc,
                  identresult: this.props.identResult,
                }}
                value={(() => {
                  console.log("value", this.state.value);
                  console.log("idres", this.props.identresult);
                  console.log("props", this.props);
                  if (
                    Object.keys(this.props.identresult).includes(
                      this.props.valSource
                    ) &&
                    this.state.value === this.props.valSource
                  ) {
                    return this.props.identresult[this.props.valSource];
                  } else {
                    return this.state.value;
                  }
                })()}
                disabled={false} // Optional.[Bool].Default: false.
                validationCallback={(res) => {
                  // this.setState({ hasNameError: res, validate: true });
                }} // Optional.[Func].Default: none. Return the validation result.
                optionList={
                  this.state.comboSrc.length > 0 ? this.state.comboSrc : []
                }
                // Required.[Array of Object(s)].Default: [].
                classNameSelect="" // Optional.[String].Default: "".
                classNameWrapper="" // Optional.[String].Default: "".
                classNameContainer="" // Optional.[String].Default: "".
                classNameOptionListContainer="" // Optional.[String].Default: "".
                classNameOptionListItem="" // Optional.[String].Default: "".
                customStyleSelect={{}} // Optional.[Object].Default: {}.
                customStyleWrapper={{}} // Optional.[Object].Default: {}.
                customStyleContainer={{}} // Optional.[Object].Default: {}.
                customStyleOptionListContainer={{
                  maxHeight: "200px",
                  overflow: "auto",
                  fontSize: "14px",
                }} // Optional.[Object].Default: {}.
                customStyleOptionListItem={{}} // Optional.[Object].Default: {}.
                onChange={(res, e) => {
                  // const changedParam = { name: this.props.name, value: res };
                  const changedParam = { name: this.props.name, value: res.id };
                  this.setState(
                    {
                      changedParam,
                      value: res.id,
                      validate: res ? false : true,
                    },
                    () => {
                      console.log("state after setstate", this.state);
                      console.log("props after setstate", this.props);
                    }
                  );
                  this.props.parentComboCallback(changedParam);
                }} // Optional.[Func].Default: () => {}. Will return the value.
                onBlur={() => {}} // Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
                // onFocus={(e) => {console.log(e);}} // Optional.[Func].Default: none.
                // onClick={(e) => {console.log(e);}} // Optional.[Func].Default: none.
                // selectHtml={<div>{countryItem.name}</div>} // Optional.[Html].Default: none. The custom html that will display when user choose. Use it if you think the default html is ugly.

                // )} // Optional.[Html].Default: none. The custom select options item html that will display in dropdown list. Use it if you think the default html is ugly.
                validationOption={{
                  name: this.props.name, // Optional.[String].Default: "". To display in the Error message. i.e Please select a ${name}.
                  check: false, // Optional.[Bool].Default: true. To determin if you need to validate.
                  required: false,
                  // Optional.[Bool].Default: true. To determin if it is a required field.
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
