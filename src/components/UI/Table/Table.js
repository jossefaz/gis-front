import React from "react";
import { Segment, Dropdown, Checkbox } from "semantic-ui-react";
import { useTable } from "react-table";
import "./style.css";
import ActionRegistry from "./Actions";
import EditableCell from "./EditableCell";

export default (props) => {
  const data = React.useMemo(() => props.data, [props.data]);
  const columns = React.useMemo(() => props.columns, [props.columns]);
  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    allColumns,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    updateData: props.updateData,
    autoResetPage: !props.skipPageReset,
  });

  return (
    <React.Fragment>
      <Dropdown item simple text="Show/Hide columns">
        <Dropdown.Menu>
          {allColumns.map(({ id, getToggleHiddenProps }) => (
            <Dropdown.Item key={id}>
              <input type="checkbox" {...getToggleHiddenProps()} /> {id}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="cHeaders">
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="cRow">
                      {cell.column.id !== "actions" && cell.render("Cell")}
                      {cell.column.id === "actions" &&
                        cell.value.map((actionName) => (
                          <button
                            key={actionName}
                            onClick={() => ActionRegistry[actionName].fn(row)}
                          >
                            {actionName}
                          </button>
                        ))}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </React.Fragment>
  );
};
