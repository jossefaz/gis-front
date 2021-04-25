import React, { useState } from "react";
import { Textbox } from "react-inputs-validation";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import "../styles.css";
import { Button, Modal, Input, Tooltip, Form } from "antd";
import { QuestionCircleTwoTone } from "@ant-design/icons";
import FormItem from "antd/lib/form/FormItem";
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { forwardRef } from "react";
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export default class CurrRowTableType extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    visible: false,
    type: "",
    name: "",
    helperfunc: null,
    identresult: "",
    rule: "",
    validate: false,
    value: "",
    mandatory: "",
    isModalVisible: false,
    data: this.props.data,
  };
  paramType = this.props.type;

  validateSplits(splits) {
    var splitsLenSum = 0;
    splits.forEach((element) => {
      splitsLenSum += parseFloat(element.len);
      if (element.min > element.len) return false;
    });
    if (splitsLenSum != this.props.cycle) return false;
    else return true;
  }

  render() {
    this.columns = [
      {
        title: "index",
        field: "index",
        editable: (_, rowData) => rowData === false,
      },
      {
        title: "name",
        field: "name",
        editable: (_, rowData) => rowData === false,
      },
      {
        title: "len",
        field: "len",
      },
      {
        title: "min",
        field: "min",
        editable: (_, rowData) => rowData === false,
      },
    ];
    console.log(this.columns);

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

    var func = null;
    var showModal = () => {
      var s = this.state;

      this.setState({ isModalVisible: true });
      console.log(this.columns);
    };

    const handleOk = (values) => {
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
                      style={{ fontSize: "25px", height: "25px" }}
                      // shape="circle-outline"
                      onClick={() => showModal()}
                    >
                      {/* ? */}
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
              <MaterialTable
                icons={tableIcons}
                title=""
                columns={this.columns}
                options={{
                  search: false,
                  //emptyRowsWhenPaging: true, //to make page size fix in case of less data rows
                  //pageSizeOptions: [5],
                }}
                data={this.state.data}
                editable={{
                  isDeletable: (rowData) => false, // disabled,
                  onBulkUpdate: (changes) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        var changesArray = [];
                        for (var it in changes) {
                          changesArray.push(changes[it]);
                        }
                        for (
                          var i = 0;
                          i < this.props.identresult.splits.length;
                          i++
                        ) {
                          var itByIndex = changesArray.filter(
                            (item) =>
                              item.newData.index ==
                              this.props.identresult.splits[i].index
                          );
                          if (itByIndex.length == 1) {
                            this.props.identresult.splits[i] =
                              itByIndex[0].newData;
                          }
                        }
                        var valid = this.validateSplits(
                          this.props.identresult.splits
                        );
                        if (!valid) {
                          alert("נתוני ה splits אינם תקינים");
                          return;
                        }

                        this.setState((prevState) => ({
                          data: [
                            ...prevState.data,
                            this.props.identresult.splits,
                          ],
                        }));
                        this.props.parentTableCallback(this.state.data);
                      }, 1000);
                      resolve();
                    }),
                  onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                      setTimeout(() => {
                        resolve();
                        this.setState((prevState) => {
                          const data = [...prevState.data];
                          data.splice(data.indexOf(oldData), 1);
                          return { ...prevState, data };
                        });
                      }, 600);
                    }),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
