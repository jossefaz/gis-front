import React, { Component } from "react";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import "./styles.css";
import Modal from "./Modal/Modal";
import CurrRowStringType from "./CurrentRowStringType/CurrentRowStringType";
import CurrentRowTableType from "./CurrentRowTableType/CurrentRowTableType";
import _ from "lodash";

class MTCS_CpsParametersTofesComponent extends Component {
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
    var initRelResult = [];

    for (const el in this.props.identifyResult) {
      if (el == "cont") {
        const initParam = {
          name: "cont",
          value: this.props.identifyResult["cont"].toString(),
        };
        initRelResult.push(initParam);
      }
      if (el == "cycle") {
        const initParam = {
          name: "cycl",
          value: this.props.identifyResult["cycle"],
        };
        initRelResult.push(initParam);
      }
      if (el == "offset") {
        const initParam = {
          name: "offs",
          value: this.props.identifyResult["offset"],
        };
        initRelResult.push(initParam);
      }
      if (el == "splits") {
        var result = "";
        for (var i = 0; i < this.props.identifyResult["splits"].length; i++) {
          if (i == 0 && this.props.identifyResult["splits"][i].len) {
            result = result.concat(
              "",
              this.props.identifyResult["splits"][i].len
            );
          } else {
            if (this.props.identifyResult["splits"][i].len)
              result = result.concat(
                " ",
                this.props.identifyResult["splits"][i].len
              );
          }
        }
        const initParam = {
          name: "spli",
          value: result,
        };
        initRelResult.push(initParam);
      }
    }
    this.state.rows = initRelResult;
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
    rowData.value = parseInt(rowData.value);
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

  callbackTableFunction = (rowData) => {
    if (!rowData) return;
    rowData.pop();
    var result = "";
    for (var i = 0; i < rowData.length; i++) {
      if (i == 0 && rowData[i].len) {
        result = result.concat("", rowData[i].len);
      } else {
        if (rowData[i].len) result = result.concat(" ", rowData[i].len);
      }
    }
    const changedParam = {
      name: "spli",
      value: result,
    };
    const elementsIndex = this.state.rows.findIndex(
      (element) => element.name == "splits"
    );
    let newArray = null;
    if (elementsIndex != -1) {
      newArray = [...this.state.rows];
      newArray[elementsIndex] = changedParam;
      this.setState({ rows: newArray });
    } else {
      this.setState((prevState) => ({
        rows: [...prevState.rows, changedParam],
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
    if (
      this.bankPkudRow.ID != 56 &&
      this.bankPkudRow.ID != 78 &&
      this.bankPkudRow.ID != 89
    ) {
      alert("לא ניתן לשלוח את הפקודה");
      return;
    }
    var errors = null;

    var schData = JSON.parse(this.props.data.value);
    errors = this.validateTofes(schData, this.state.rows);
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
      var mapped = this.state.rows.map((item) => ({
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
        })
        .catch((err) => {
          console.log("pkuda send response error", err);
          alert("פקודה לא נשלחה" + err);
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
          !resultData.some((e) => !e.value)
        ) {
        } else {
          error.push(row.name);
        }
      } else {
      }
    });

    //validate that sum of lengths equal to cycle
    var cycle = null;
    var splitsSum = 0;
    resultData.forEach((row) => {
      if (row.name == "cycl") {
        cycle = parseInt(row.value);
      }
      if (row.name == "spli") {
        var splitsArray = row.value.split(" ");
        splitsArray.forEach((element) => {
          splitsSum += parseInt(element);
        });
      }
    });
    if (splitsSum != cycle) {
      error.push("sum of splits should be equal to cycle ");
    }
    return error;
  }

  handleCancel = (e) => {
    console.log(e);
    this.props.toggleModal();
  };

  async componentDidMount() {
    this.setInitialValuesFromIdentifyResult();
  }

  updateNotGenericItemParams = (serverParams) => {
    serverParams.forEach((element) => {
      if (element.name == "cont") {
        element.UItype = "number";
      }
      if (element.name == "cycl") {
        element.name = "cycle";
        element.UItype = "number";
      }
      if (element.name == "offs") {
        element.name = "offset";
        element.UItype = "number";
      }
      if (element.name == "spli") {
        element.name = "splits";
        element.UItype = "table";
      }
    });
    return serverParams;
  };

  render() {
    var serverParams = JSON.parse(this.props.data.value);
    var customParams = this.updateNotGenericItemParams(serverParams);
    this.paramsData = customParams;
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
                  mandatory={this.paramsData[index]["mandatory"]}
                  localconfig={this.props.localconfig}
                />
              ) : row.UItype === "table" ? (
                <CurrentRowTableType
                  parentTableCallback={this.callbackTableFunction}
                  key={this.paramsData[index]["name"]}
                  name={this.paramsData[index]["name"]}
                  type={this.paramsData[index]["UItype"]}
                  rule={this.paramsData[index]["rule"]}
                  helperfunc={this.paramsData[index]["helper function"]}
                  identresult={this.props.identifyResult}
                  data={this.props.identifyResult.splits}
                  cycle={this.props.identifyResult.cycle}
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

export default MTCS_CpsParametersTofesComponent;
