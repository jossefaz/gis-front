import React from "react";
import { Segment, Dropdown, Checkbox } from "semantic-ui-react";
import { useTable } from "react-table";

export default (props) => {
  const data = React.useMemo(() => props.data, [props.data]);

  const columns = React.useMemo(() => props.columns, [props.columns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    allColumns,
    rows,
    prepareRow,
  } = useTable({ columns, data });

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
                <th
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: "solid 3px red",
                    background: "aliceblue",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
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
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: "10px",
                        border: "solid 1px gray",
                        background: "papayawhip",
                      }}
                    >
                      {cell.render("Cell")}
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
