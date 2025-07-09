import React from "react";
import { FaSort, FaFilter } from "react-icons/fa";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "center" | "right";
}

interface TableHeaderProps {
  columns: TableColumn[];
  onSort?: (key: string) => void;
  onFilter?: (key: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  onSort,
  onFilter,
}) => {
  return (
    <thead className="bg-violet-800 text-white border-b border-amber-500">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={`text-sm sm:text-base font-semibold text-left 
            `}
          >
            <div className="flex items-center gap-2 justify-start">
              <span>{col.label}</span>
              {col.sortable && (
                <FaSort
                  className="cursor-pointer text-amber-400 hover:text-yellow-500"
                  size={14}
                  onClick={() => onSort && onSort(col.key)}
                />
              )}
              {col.filterable && (
                <FaFilter
                  className="cursor-pointer text-amber-400 hover:text-yellow-500"
                  size={14}
                  onClick={() => onFilter && onFilter(col.key)}
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
