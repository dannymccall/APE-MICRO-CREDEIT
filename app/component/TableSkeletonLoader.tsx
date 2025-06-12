import React from 'react';

interface TableSkeletonLoaderProps {
  rows?: number;
  columns?: number;
}

const TableSkeletonLoader: React.FC<TableSkeletonLoaderProps> = ({
  rows = 15,
  columns = 5,
}) => {
  // Customize column widths based on expected data
  const columnWidths = ['w-96', 'w-96', 'w-96', 'w-96', 'w-96'];

  return (
    <tbody className=" w-full  text-center p-4 flex flex-col items-center justify-center laptop:mt-20">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse border-b border-gray-200">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="p-2">
              <div
                className={`h-4 bg-gray-300 rounded desktop:w-72 phone:w-12 tablet:w-60`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableSkeletonLoader;
