// src/renderer/src/components/data/DataGrid.jsx
const DataGrid = ({ 
  data, 
  columns, 
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectionChange
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-[#1B1B26] rounded-xl overflow-hidden">
        <thead className="bg-[#2A2A40]">
          <tr>
            {selectable && (
              <th className="w-8 p-3">
                <input 
                  type="checkbox"
                  className="rounded bg-[#14141F] border-[#38ff9b]/30 text-[#38ff9b]
                           focus:ring-[#38ff9b]/20 focus:ring-offset-0"
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelectionChange(data.map(row => row.id));
                    } else {
                      onSelectionChange([]);
                    }
                  }}
                  checked={selectedRows.length === data.length}
                />
              </th>
            )}
            {columns.map((column) => (
              <th 
                key={column.field} 
                className="p-3 text-left text-gray-400 font-medium"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2A2A40]">
          {data.map((row) => (
            <tr 
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`hover:bg-[#2A2A40] transition-colors cursor-pointer
                       ${selectedRows.includes(row.id) ? 'bg-[#38ff9b]/5' : ''}`}
            >
              {selectable && (
                <td className="w-8 p-3">
                  <input 
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelectionChange([...selectedRows, row.id]);
                      } else {
                        onSelectionChange(selectedRows.filter(id => id !== row.id));
                      }
                    }}
                    className="rounded bg-[#14141F] border-[#38ff9b]/30 text-[#38ff9b]
                             focus:ring-[#38ff9b]/20 focus:ring-offset-0"
                    onClick={e => e.stopPropagation()}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.field} className="p-3 text-white">
                  {column.render ? column.render(row) : row[column.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { DataGrid };