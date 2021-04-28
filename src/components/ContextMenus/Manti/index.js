import * as React from "react";
import { alpha, makeStyles, withStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import _ from "lodash";
import { uuid } from "uuidv4";
import ParametersTofes from "./ParametersTofes";
import MTCS_CpsParametersTofes from "./MTCS_CpsParametersTofes";
import axios from "axios";
import TreeItems from "./GroupData";

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const classes = useStyles;

export default class BankPkudotTree extends React.Component {
  state = {
    modalVisible: false,
    rawData: this.props.menu_config,
    genericItem: true,
    groupedData: null,
    pkudaData: null,
  };

  groupArray(data, property) {
    const data_copy = [...data];
    for (var currCat in data) {
      var objNextCat = this.convertElementToObject(data, property, currCat);

      var bynextParam = _.groupBy(
        objNextCat.children,
        property === "category" ? "AdaptorId" : "category"
      );
      var arrAdapt = [];
      for (var ad in bynextParam) {
        var itemName = ad;
        var adObj = {
          key: uuid(),
          name: itemName,
          children: bynextParam[ad],
        };
        var a = [];
        adObj.children.forEach((element) => {
          var adObjLast = {
            key: element.ID,
            name: element.Name,
            children: [],
          };
          a.push(adObjLast);
        });
        adObj.children = a;
        arrAdapt.push(adObj);
      }

      objNextCat.children = arrAdapt;
      data_copy[currCat] = objNextCat;
    }
    this.setState({ groupedData: data_copy });
  }

  convertElementToObject(data, property, currCat) {
    var itemName = "";
    var objCateg = null;
    if (Array.isArray(data) && Array.isArray(data[currCat])) {
      itemName =
        data[currCat][0][property] !== null ||
        data[currCat][0][property] !== "null"
          ? data[currCat][0][property]
          : "Uncategorized";
      objCateg = {
        key: uuid(),
        name: itemName !== null ? itemName : "Uncategorized",
        children: data[currCat],
      };
    } else {
      itemName =
        data[0][property] !== null || data[0][property] !== "null"
          ? data[0][property]
          : "Uncategorized";
      objCateg = {
        key: uuid(),
        name: itemName,
        children: data,
      };
    }

    return objCateg;
  }

  toggleModal = () => {
    this.setState((oldState) => {
      return {
        modalVisible: !oldState.modalVisible,
      };
    });
  };

  fetchPkuda = async (item) => {
    const { data } = await axios.get(
      this.props.local_config.pkudatItemByIdAddress + item.key
    );
    this.setState({
      pkudaData: data,
      modalVisible: true,
      selectedItem: item.key,
    });
  };

  renderModal = (pkudaData) => {
    return this.state.genericItem ? (
      <ParametersTofes
        toggleModal={this.toggleModal}
        findItemByName={this.findItemByName}
        data={{ value: pkudaData.Parameters }}
        localconfig={this.props.local_config}
        bankPkudotRow={pkudaData}
        mapId={222}
        identifyResult={
          this.state.identifyResult ? this.state.identifyResult : {}
        }
        commandApiAddress={this.props.local_config.commandApiAddress}
      />
    ) : (
      <MTCS_CpsParametersTofes
        toggleModal={this.toggleModal}
        findItemByName={this.findItemByName}
        data={(() => {
          return { value: pkudaData.Parameters };
        })()}
        localconfig={this.props.local_config}
        bankPkudotRow={pkudaData}
        mapId={222}
        identifyResult={
          this.state.identifyResult ? this.state.identifyResult : {}
        }
        commandApiAddress={this.props.local_config.commandApiAddress}
      />
    );
  };

  findItemByName = (commandId, adaptorId, data) => {
    var itByAdaptor = this.props.menu_config[0].filter(
      (item) => item.AdaptorId == adaptorId
    );
    var itByName = itByAdaptor.filter((i) => i.Name == commandId);

    this.setState(
      {
        selectedItem: itByName[0].ID,
        identifyResult: data,
        genericItem: false,
        pkudaData: itByName[0],
      },
      () => this.toggleModal()
    );
  };

  componentDidMount() {
    this.groupArray(this.props.menu_config, "category");
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.modalVisible != this.state.modalVisible ||
      nextState.selectedItem != this.state.selectedItem ||
      nextState.groupedData != this.state.groupedData
    );
  }

  render() {
    return (
      <React.Fragment>
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <TreeItems
            groupData={this.state.groupedData}
            fetchPkuda={this.fetchPkuda}
          />
        </TreeView>
        {this.state.modalVisible &&
          this.state.pkudaData &&
          this.renderModal(this.state.pkudaData)}
      </React.Fragment>
    );
  }
}
