import { Component } from "react";
import _ from "lodash";
import TreeItem from "@material-ui/lab/TreeItem";

export default class GroupData extends Component {
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
          nodeId={`${treeItemData.key}`}
          label={this.renderLabel(treeItemData)}
          children={children}
        />
      );
    });
  }

  renderLabel = (item) => (
    <span
      onClick={async () => {
        if (item.children.length == 0) {
          await this.props.fetchPkuda(item);
        }
      }}
    >
      {item.name}
    </span>
  );

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextProps.groupData, this.props.groupData);
  }
  render() {
    return <div>{this.getTreeItemsFromData(this.props.groupData)}</div>;
  }
}
