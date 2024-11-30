import React from "react";

interface TableProps {
  headers: { label: number; key: string }[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
  emptyMessage?: string;
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  renderRow,
  emptyMessage = "No data found.",
}) => {
  return (
    <div className="overflow-x-auto shadow-xl shadow-gray-800 border border-gray-100">
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="bg-primary-bg-2 text-white">
            {headers.map((header) => (
              <th key={header.label} className="p-4">
                {header.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                className="odd:bg-sec-bg-1 even:bg-sec-bg-2 hover:bg-primary-bg-1 transition-all"
              >
                {renderRow(item)}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="p-4 text-center text-gray-500 font-semibold"
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
