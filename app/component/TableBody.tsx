interface ColumnConfig<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableBodyProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  footerRow?: React.ReactNode;
}

function TableBody<T>({ data, columns, footerRow }: TableBodyProps<T>) {
  return (
    <tbody>
      {data.map((item, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((col, colIndex) => {
            const value:any =
              typeof col.accessor === "function"
                ? col.accessor(item)
                : item[col.accessor];

            return (
              <td
                key={colIndex}
                className={
                  col.className ??
                  "text-sm font-sans font-normal text-gray-700 p-1 border"
                }
              >
                {value}
              </td>
            );
          })}
        </tr>
      ))}
      {footerRow && footerRow}
    </tbody>
  );
}

export default TableBody
