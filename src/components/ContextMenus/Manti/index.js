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
  };
  constructor(props) {
    super(props);
  }

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
            // "name: " +
            // element.Name +
            // ", id: " +
            // element.ID +
            // ", description: " +
            // element.description,
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
    console.log("groupedData", data);
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

  onItemClick = (e) => {
    var s = e.currentTarget.lastChild.nodeValue;
    this.setState({
      modalVisible: true,
      selectedItem: e.currentTarget.lastChild.nodeValue,
    });
  };

  toggleModal = () => {
    this.setState((oldState) => {
      return {
        modalVisible: !oldState.modalVisible,
      };
    });
  };

  fetchSpecificItem() {
    debugger;
    fetch(
      this.props.local_config.pkudatItemByIdAddress + this.state.selectedItem
    )
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          pkudaData: result,
        });
      })
      .catch((error) => {
        alert("There was an error fetching data !" + error);
      });
  }

  renderModal(value) {
    if (
      !this.state.pkudaData ||
      this.state.pkudaData.ID != this.state.selectedItem
    ) {
      this.fetchSpecificItem();
    }

    return this.state.modalVisible &&
      this.state.pkudaData &&
      this.state.genericItem ? (
      <ParametersTofes
        toggleModal={this.toggleModal}
        findItemByName={this.findItemByName}
        data={(() => {
          console.log("generic tofes", this.state.pkudaData.Parameters);
          return { value: this.state.pkudaData.Parameters };
        })()}
        localconfig={this.props.local_config}
        bankPkudotRow={this.state.pkudaData}
        mapId={222}
        identifyResult={
          this.state.identifyResult ? this.state.identifyResult : {}
        }
        commandApiAddress={this.state.commandApiAddress}
      />
    ) : (
      this.state.modalVisible &&
        this.state.pkudaData &&
        !this.state.genericItem && (
          <MTCS_CpsParametersTofes
            toggleModal={this.toggleModal}
            findItemByName={this.findItemByName}
            data={(() => {
              console.log("not generic tofes", this.state.pkudaData.Parameters);
              return { value: this.state.pkudaData.Parameters };
            })()}
            localconfig={this.props.local_config}
            bankPkudotRow={this.state.pkudaData}
            mapId={222}
            identifyResult={
              this.state.identifyResult ? this.state.identifyResult : {}
            }
            commandApiAddress={this.state.commandApiAddress}
          />
        )
    );
  }

  renderLabel = (item) => (
    <span
      onClick={(event) => {
        if (item.children.length == 0) {
          this.setState({
            modalVisible: true,
            selectedItem: item.key,
          });
          console.log(item.key);
        }
      }}
    >
      {item.name}
    </span>
  );

  getTreeItemsFromData(treeItems) {
    if (treeItems === null) return;
    return treeItems.map((treeItemData) => {
      let children = undefined;
      if (treeItemData.children && treeItemData.children.length > 0) {
        children = this.getTreeItemsFromData(treeItemData.children);
      }
      return (
        <TreeItem
          key={treeItemData.key}
          nodeId={treeItemData.key}
          label={this.renderLabel(treeItemData)}
          children={children}
        />
      );
    });
  }

  findItemByName = (commandId, adaptorId, data) => {
    var itByAdaptor = this.props.menu_config[0].children.filter(
      (item) => item.name == adaptorId
    );
    var itByName = itByAdaptor[0].children.filter((i) => i.name == commandId);

    this.setState({
      selectedItem: itByName[0].key,
      identifyResult: data,
      genericItem: false,
    });

    // this.renderModal(itByName[0].key);
  };

  componentDidMount() {
    this.setState({
      getPkudaByIdAddress: this.props.getPkudaById,
      mockupApiAddress: this.props.mockupApi,
      commandApiAddress: this.props.commandApiAddress,
    });
    this.groupArray(this.props.menu_config, "category");
  }

  render() {
    return (
      <React.Fragment>
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {this.state.groupedData
            ? this.getTreeItemsFromData(this.state.groupedData)
            : console.log(this.state.groupedData)}
        </TreeView>
        {this.state.modalVisible && this.renderModal(this.state.selectedItem)}
      </React.Fragment>
    );
  }
}
