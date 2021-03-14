import React from "react";
import { Segment, Dropdown, Checkbox } from "semantic-ui-react";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import "./style.css";
import API from "../../../core/api";
import ActionRegistry from "./Actions";
import Search from "./Filters/Global";
import DirectionProvider, {
  DIRECTIONS,
} from "react-with-direction/dist/DirectionProvider";
export default (props) => {
  const data = React.useMemo(() => props.data, [props.data]);
  const columns = React.useMemo(() => props.columns, [props.columns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    allColumns,
    rows,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },

    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy
  );

  return (
    <DirectionProvider direction={DIRECTIONS.RTL}>
      <React.Fragment>
        <div className="actions">
          <div>
            <Search
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
          <div>
            <Dropdown item simple text="Show/Hide columns">
              <Dropdown.Menu>
                {allColumns.map(({ id, getToggleHiddenProps }) => (
                  <Dropdown.Item key={id}>
                    <input type="checkbox" {...getToggleHiddenProps()} /> {id}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="tableFixHead">
          <table {...getTableProps()} className="blueTable">
            <thead className="cthead">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="cth cHeaders"
                    >
                      <div className="sortingHeader">
                        <div> {column.render("Header")}</div>
                        <div>
                          {" "}
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="ctbody">
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onDoubleClick={() =>
                      API.features.zoomTo(row.original.geometry)
                    }
                    style={{ cursor: "pointer" }}
                    className="ctr"
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()} className="cRow ctd">
                          {cell.column.id !== "actions" && cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    </DirectionProvider>
  );
};
// {//If action column needed}
//   {/* {cell.column.id === "actions" &&
//     cell.value.map((actionName) => (
//       <button
//         key={actionName}
//         onClick={() => ActionRegistry[actionName].fn(row)}
//       >
//         {actionName}
//       </button>
//     ))} */}
