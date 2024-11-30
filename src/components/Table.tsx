import React from "react";

interface TableProps<T> {
  headers: Array<{
    key_v: string;
    key: string;
    sortable?: boolean;
    renderHeader?: () => React.ReactNode;
  }>;
  data: T[];
  renderRow: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

const Table = <T,>({
  headers,
  data = [],
  renderRow,
  emptyMessage = "No data available",
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto bg-sec-bg-1 rounded-lg shadow-md border border-gray-200">
      <table className="w-full border-collapse">
        <thead className="bg-primary-bg-2 text-white">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className="p-4 text-left font-semibold border-b border-gray-700"
              >
                {header.renderHeader ? header.renderHeader() : header.key_v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-primary-bg-1 transition-colors duration-200 border-b border-gray-700 last:border-b-0"
              >
                {renderRow(item)}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center p-4 text-color-text opacity-70"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
