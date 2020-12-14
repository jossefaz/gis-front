import React, { Component } from "react";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import "./styles.css";
import withNotifications from "../../../HOC/withNotifications";
import { Modal } from "antd";
import CurrRowStringType from "./CurrentRowStringType/CurrentRowStringType";
import CurrRowComboType from "./CurrentRowComboType/CurrentRowComboType";
import CurrRowDatePickerType from "./CurrentRowDatePickerType/CurrentRowDatePickerType";
import _ from "lodash";

class ParametersTofesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankPkudotRow: null,
      mapId: null,
      identifyResult: null,
      name: "",
      number: "",
      validate: true,
      visible: false,
      rows: [],
      data: "",
      //{"address":{"ON":"הדלקת שלטים","OFF":"כיבוי שלטים"},"type":"internal"}
      // comboSourceJson : {"address":"http://localhost:5002/api/MockupData/byName?","name":"combogenerator" ,"filter":"cameras","limit":"3","outparams":"CameraID,CameraName","type":"api"}
      //http://localhost:5002/api/MockupData/byName?name=combogenerator&filter=cameras&limit=3&outparams=CameraID,CameraName
      //data:[{"name":"cameraID","type":"String","helper function":"cam_id","UItype":"string","tableData":{"id":0}},{"name":"Camera type","type":"String","helper function":"cam_id","UItype":"combo","tableData":{"id":0}},{"name":"Date","type":"String","helper function":"cam_id","UItype":"date","tableData":{"id":0}},{"name":"angle","type":"Integer","rule":"0<x<356","UItype":"number","tableData":{"id":1}}]
    };
    this.validateForm = this.validateForm.bind(this);
  }

  //add selected value into state of modal
  callbackStringFunction = (rowData) => {
    if (!rowData) return;
    const elementsIndex = this.state.rows.findIndex(
      (element) => element.Name == rowData.Name
    );
    let newArray = null;
    if (elementsIndex != -1) {
      newArray = [...this.state.rows];
      newArray[elementsIndex] = rowData;
      this.setState({ rows: newArray });
    } else {
      this.setState((prevState) => ({
        rows: [...prevState.rows, rowData],
      }));
    }
  };

  //add selected value into state of modal
  callbackIntFunction = (rowData) => {
    if (!rowData) return;
    const elementsIndex = this.state.rows.findIndex(
      (element) => element.Name == rowData.Name
    );
    let newArray = null;
    if (elementsIndex != -1) {
      newArray = [...this.state.rows];
      newArray[elementsIndex] = rowData;
      this.setState({ rows: newArray });
    } else {
      this.setState((prevState) => ({
        rows: [...prevState.rows, rowData],
      }));
    }
  };

  setInitialValuesFromIdentifyResult = () => {
    var params = JSON.parse(this.props.data.value);
    var newArray = [];
    for (var currParam in params) {
      if (
        this.props.identifyResult[params[currParam].name] &&
        params[currParam]["value source"]
      ) {
        newArray.push({
          name: params[currParam].name,
          value: this.props.identifyResult[params[currParam].name],
        });
      }
    }
    newArray.length > 0 && this.setState({ rows: newArray });
  };

  //add selected value into state of modal
  callbackComboFunction = (rowData) => {
    if (!rowData) return;
    const elementsIndex = this.state.rows.findIndex(
      (element) => element.name == rowData.name
    );
    let newArray = null;
    if (elementsIndex != -1) {
      newArray = [...this.state.rows];
      newArray[elementsIndex] = rowData;
      this.setState({ rows: newArray });
    } else {
      this.setState((prevState) => ({
        rows: [...prevState.rows, rowData],
      }));
    }
  };

  //add selected value into state of modal
  callbackDateFunction = (rowData) => {
    if (!rowData) return;
    const elementsIndex = this.state.rows.findIndex(
      (element) => element.name == rowData.name
    );
    let newArray = null;
    if (elementsIndex != -1) {
      newArray = [...this.state.rows];
      newArray[elementsIndex] = rowData;
      this.setState({ rows: newArray });
    } else {
      this.setState((prevState) => ({
        rows: [...prevState.rows, rowData],
      }));
    }
  };

  toggleValidating(validate) {
    this.setState({ validate });
  }

  validateForm(e) {
    e.preventDefault();
    this.toggleValidating(true);
    const {
      value,
      hasNameError,
      hasDescriptionError,
      hasMovieError,
      hasJobError,
      hasAgreementError,
    } = this.state;
    if (
      !hasNameError &&
      !hasDescriptionError &&
      !hasMovieError &&
      !hasJobError &&
      !hasAgreementError
    ) {
      alert("All validated!");
    }
  }

  handleOk = () => {
    if (this.props.bankPkudotRow.ID != 1) {
      alert("לא ניתן לשלוח את הפקודה");
      return;
    }
    var errors = null;

    var schData = JSON.parse(this.props.data.value);
    var resData = this.state.rows;

    errors = this.validateTofes(schData, resData);
    var errorString = "";
    errors.forEach((str) => {
      errorString += str + ",";
    });
    errorString = errorString.slice(0, -1);
    if (errors.length > 0) {
      alert("שי למלא " + errorString);
      return;
    }

    console.log(this.state.rows);
    if (errors.length === 0) {
      var mapped = resData.map((item) => ({
        [item.name]: item.value,
      }));

      var resPrms = Object.assign({}, ...mapped);
      console.log(resPrms);
      var resultBody = {
        controlSystem: this.props.bankPkudotRow.AdaptorId,
        functionName: this.props.bankPkudotRow.Name,
        prms: resPrms,
      };
      const postMethod = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8", // Indicates the content
        },

        body: JSON.stringify(resultBody),
      };

      var apiAddress = this.props.local_config["commandApiAddress"];
      console.log("Will be sent to the server :", JSON.stringify(resultBody));
      this.props.successNotification("Successfully sent action to MTCS !");
      // fetch(apiAddress, postMethod)
      //   .then((response) => response.json())
      //   .then((data) => {
      //     alert("פקודה נשלחה");
      //     console.log(data);
      //   })
      //   .catch((err) => {
      //     alert("פקודה לא נשלחה" + err);
      //   });

      this.props.toggleModal();
    }
  };

  validateTofes(schema, resultData) {
    var error = [];

    schema.forEach((row) => {
      if (row.mandatory || row.mandatory == "true") {
        if (
          resultData.length === 0 ||
          // !resultData.some((e) => e.currRow.name === row.name) ||
          // !resultData.some((e) => e.currRow.value)
          !resultData.some((e) => e.name === row.name) ||
          !resultData.some((e) => e.value)
        ) {
          error.push(row.name);
        } else {
        }
      } else {
      }
    });

    return error;
  }

  handleCancel = (e) => {
    console.log(e);
    this.props.toggleModal();
  };

  componentDidMount() {
    this.setInitialValuesFromIdentifyResult();
  }
  //http://localhost:5002/api/MockupData/byName?name=combogenerator&filter=cameras&limit=3&outparams=CameraID,CameraName
  async getDataForCombo(urlCameras, comboName) {
    await Promise.all([fetch(urlCameras)])
      .then(async ([cameras, helpFunctions]) => {
        const a = cameras.json().then((result) => {
          var cmb = result;

          var arrForComboCam = [];
          cmb.forEach((element) => {
            arrForComboCam.push(element);
          });
          return arrForComboCam;
        });
      })
      .then((responseText) => {
        console.log(" api result" + responseText);

        // return responseText;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    debugger;
    const paramsData = JSON.parse(this.props.data.value);

    return (
      <div
        style={{
          minHeight: "1000px",
          padding: "10px",
          border: "1px solid #e5e5e5",
        }}
      >
        <div
          style={{
            display: "inline-flex",
          }}
        >
          <h1
            style={{
              color: "red",
            }}
          >
            {this.props.bankPkudotRow.Name}
          </h1>
          <h1> : טופס פרמטרים של הפקודה </h1>
        </div>
        <form onSubmit={this.validateForm}>
          {paramsData &&
            paramsData.map((row, index) =>
              row.UItype === "string" ? (
                <CurrRowStringType
                  parentStringCallback={this.callbackStringFunction}
                  key={paramsData[index]["name"]}
                  name={paramsData[index]["name"]}
                  type={paramsData[index]["UItype"]}
                  rule={paramsData[index]["rule"]}
                  helperfunc={paramsData[index]["helper function"]}
                  identresult={this.props.identifyResult}
                  valSource={paramsData[index]["value source"]}
                  // valSource={paramsData[index]["value source"]}
                  mandatory={paramsData[index]["mandatory"]}
                  local_config={this.props.local_config}
                />
              ) : row.UItype === "combo" ? (
                <CurrRowComboType
                  parentComboCallback={this.callbackComboFunction}
                  fillComboCallBack={this.getDataForCombo}
                  key={paramsData[index]["name"]}
                  name={paramsData[index]["name"]}
                  type={paramsData[index]["UItype"]}
                  rule={paramsData[index]["rule"]}
                  helperfunc={paramsData[index]["helper function"]}
                  identresult={this.props.identifyResult}
                  valSource={paramsData[index]["value source"]}
                  comboSource={paramsData[index]["combo source"]}
                  mandatory={paramsData[index]["mandatory"]}
                  local_config={this.props.local_config}
                />
              ) : row.UItype === "date" ? (
                <CurrRowDatePickerType
                  parentDateCallback={this.callbackDateFunction}
                  key={paramsData[index]["name"]}
                  name={paramsData[index]["name"]}
                  type={paramsData[index]["UItype"]}
                  rule={paramsData[index]["rule"]}
                  helperfunc={paramsData[index]["helper function"]}
                  identresult={this.props.identifyResult}
                  valSource={paramsData[index]["value source"]}
                  mandatory={paramsData[index]["mandatory"]}
                  local_config={this.props.local_config}
                />
              ) : (
                <CurrRowStringType
                  parentIntCallback={this.callbackIntFunction}
                  key={paramsData[index]["name"]}
                  name={paramsData[index]["name"]}
                  type={paramsData[index]["UItype"]}
                  rule={paramsData[index]["rule"]}
                  helperfunc={paramsData[index]["helper function"]}
                  identresult={this.props.identifyResult}
                  valSource={paramsData[index]["value source"]}
                  mandatory={paramsData[index]["mandatory"]}
                  local_config={this.props.local_config}
                />
              )
            )}
        </form>
        <button onClick={this.handleOk}>OK</button>
        <button onClick={this.handleCancel}>CANCEL</button>
      </div>
    );
  }
}
export default withNotifications(ParametersTofesComponent);
