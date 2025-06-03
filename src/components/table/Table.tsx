
import DataTable, { TableStyles, TableColumn } from "react-data-table-component";
import { useMediaQuery } from "react-responsive";

interface ReusableTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  customStyles?: TableStyles;
}

const defaultStyles: TableStyles = {
  table: {
    style: {
      border: "1px solid #EDEDED",
      borderRadius: "14px",
    //   overflow: "hidden",
    },
  },
  rows: {
    style: {
      minHeight: "60px",
    },
  },
  headCells: {
    style: {
      paddingTop: "15px",
      paddingBottom: "15px",
      backgroundColor: "#1E1E1E",
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: "1rem",
    },
  },
  cells: {
    style: {
      paddingTop: "15px",
      paddingBottom: "15px",
      color: "#231F20",
      fontSize: ".9rem",
    },
  },
  pagination: {
    style: {
      justifyContent: "center",
      padding: "10px",
    },
  },
};

function ReusableTable<T extends Record<string, any>>({
  columns,
  data,
  customStyles,
}: ReusableTableProps<T>) {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  if (isMobile) {
    return (
      <div className="space-y-4 py-4">
     {data.map((row, rowIndex) => {
  const actionColumn = columns.find(
    (col) =>
      typeof col.name === "string" &&
      col.name.toLowerCase() === "actions"
  );

  return (
    <div
      key={rowIndex}
      className="border border-[#EDEDED] rounded-lg p-4 mb-4 flex flex-col gap-2 bg-white"
    >
      {columns.map((col, colIndex) => {
        if (
          typeof col.name === "string" &&
          col.name.toLowerCase() === "actions"
        )
          return null;

        return (
          <div
            className="relative grid grid-cols-[2fr_2fr_1fr] items-center text-sm"
          >
            <div className="text-[#918F90] font-medium">{col.name}</div>
            <div className="flex  gap-2 text-black">
              {col.selector?.(row)}
            </div>
            <div className="absolute right-0">

              {colIndex === 0 ? actionColumn?.cell?.(row, rowIndex, actionColumn, `${rowIndex}-action`):<p></p>}
            </div>

          </div>
        );
      })}
    </div>
  );
})}


      </div>
    );
  }

  return (
    <div className="py-[25px]">
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        pointerOnHover
        customStyles={customStyles || defaultStyles}
      />
    </div>
  );
}

export default ReusableTable;
