import React, { Component } from "react";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import "./styles.css";
import Modal from "./Modal/Modal";
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
    console.log("identRes", this.props.identifyResult);
    console.log("params", this.props.data.value);
    var params = JSON.parse(this.props.data.value);
    var newArray = [];
    var idRes = Object.keys(this.props.identifyResult).map((key) => ({
      key,
      value: this.props.identifyResult[key],
    }));
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

  handleOk = (e) => {
    if (this.bankPkudRow.ID != 56 && this.bankPkudRow.ID != 78) {
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
        controlSystem: this.bankPkudRow.AdaptorId,
        functionName: this.bankPkudRow.Name,
        prms: resPrms,
      };
      const postMethod = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8", // Indicates the content
        },

        body: JSON.stringify(resultBody),
      };

      var apiAddress = this.props.commandApiAddress;
      fetch(apiAddress, postMethod)
        .then((response) => response.json())
        .then((data) => {
          // alert("פקודה נשלחה");
          if (data.ResultCode <= 0) {
            alert(data.ResultMessage);
            return;
          }
          if (this.props.bankPkudotRow.templateComponent) {
            var comId = JSON.parse(
              this.props.bankPkudotRow.templateComponent
            )[0].commandId;
            var adapId = JSON.parse(
              this.props.bankPkudotRow.templateComponent
            )[0].adaptorId;
            var par = this.props.findItemByName(
              comId,
              adapId,
              data.ResultValue
            );
            console.log("toggle 1");
            this.props.toggleModal(); // close origin form
            console.log("toggle 1.5");
          }
          console.log("pkuda send response", data);
          console.log("pkuda send response", this.props);
        })
        .catch((err) => {
          console.log("pkuda send response error", err);
          //alert("פקודה לא נשלחה" + err);
        });

      console.log("toggle 2");
      this.props.toggleModal(); // open non generic form
    }
  };

  validateTofes(schema, resultData) {
    var error = [];

    schema.forEach((row) => {
      if (row.mandatory || row.mandatory == "true") {
        if (
          resultData.length === 0 ||
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

  async componentDidMount() {
    this.setInitialValuesFromIdentifyResult();
  }

  render() {
    this.paramsData = JSON.parse(this.props.data.value);
    this.bankPkudRow = this.props.bankPkudotRow;
    this.identifyResult = this.props.identifyResult;
    const { row, visible, validate } = this.state;
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
      <Modal isModalOpen={true} closeModal={this.props.toggleModal}>
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
            {this.bankPkudRow.Name}
          </h1>
          <h1> : טופס פרמטרים של הפקודה </h1>
        </div>
        <form>
          {/* // onSubmit={this.validateForm}> */}
          {this.paramsData &&
            this.paramsData.map((row, index) =>
              row.UItype === "string" ? (
                <CurrRowStringType
                  parentStringCallback={this.callbackStringFunction}
                  key={this.paramsData[index]["name"]}
                  name={this.paramsData[index]["name"]}
                  type={this.paramsData[index]["UItype"]}
                  rule={this.paramsData[index]["rule"]}
                  helperfunc={this.paramsData[index]["helper function"]}
                  identresult={this.props.identifyResult}
                  valSource={this.paramsData[index]["value source"]}
                  // valSource={this.paramsData[index]["value source"]}
                  mandatory={this.paramsData[index]["mandatory"]}
                  localconfig={this.props.localconfig}
                />
              ) : row.UItype === "combo" ? (
                <CurrRowComboType
                  parentComboCallback={this.callbackComboFunction}
                  // fillComboCallBack={this.getDataForCombo}
                  key={this.paramsData[index]["name"]}
                  name={this.paramsData[index]["name"]}
                  type={this.paramsData[index]["UItype"]}
                  rule={this.paramsData[index]["rule"]}
                  helperfunc={this.paramsData[index]["helper function"]}
                  identresult={this.props.identifyResult}
                  valSource={this.paramsData[index]["value source"]}
                  comboSource={this.paramsData[index]["combo source"]}
                  mandatory={this.paramsData[index]["mandatory"]}
                  localconfig={this.props.localconfig}
                />
              ) : row.UItype === "date" ? (
                <CurrRowDatePickerType
                  parentDateCallback={this.callbackDateFunction}
                  key={this.paramsData[index]["name"]}
                  name={this.paramsData[index]["name"]}
                  type={this.paramsData[index]["UItype"]}
                  rule={this.paramsData[index]["rule"]}
                  helperfunc={this.paramsData[index]["helper function"]}
                  identresult={this.props.identifyResult}
                  valSource={this.paramsData[index]["value source"]}
                  mandatory={this.paramsData[index]["mandatory"]}
                  localconfig={this.props.localconfig}
                />
              ) : (
                <CurrRowStringType
                  parentIntCallback={this.callbackIntFunction}
                  key={this.paramsData[index]["name"]}
                  name={this.paramsData[index]["name"]}
                  type={this.paramsData[index]["UItype"]}
                  rule={this.paramsData[index]["rule"]}
                  helperfunc={this.paramsData[index]["helper function"]}
                  identresult={this.props.identifyResult}
                  valSource={this.paramsData[index]["value source"]}
                  mandatory={this.paramsData[index]["mandatory"]}
                  localconfig={this.props.localconfig}
                />
              )
            )}
          <div>
            <button
              onClick={(e) => {
                this.handleCancel(e);
              }}
            >
              Close
            </button>
            <button
              onClick={(e) => {
                this.handleOk(e);
              }}
            >
              OK
            </button>
          </div>
        </form>
      </Modal>
    );
  }
}
export default ParametersTofesComponent;
