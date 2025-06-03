import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface CustomPaginationProps {
  currentPage: number;
  rowsPerPage: number;
  rowCount: number;
  onChangePage: (page: number, totalRows: number, direction: string) => void; // Updated to match the expected signature
}

const CustomPagination = ({
  currentPage,
  rowsPerPage,
  rowCount,
  onChangePage,
}: CustomPaginationProps) => {
  const totalPages = Math.ceil(rowCount / rowsPerPage);

  // Determine the range of page numbers to show
  const rangeSize = 5; // Number of page buttons to show in the range (e.g., 5 pages before and after current page)
  let startPage = Math.max(1, currentPage - Math.floor(rangeSize / 2));
  let endPage = Math.min(totalPages, currentPage + Math.floor(rangeSize / 2));

  // Ensure that the range doesn't extend beyond the total pages
  if (endPage - startPage < rangeSize - 1) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + rangeSize - 1);
    } else {
      startPage = Math.max(1, endPage - rangeSize + 1);
    }
  }

  // Create an array of page numbers to display within the range
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-2">
      {/* Previous Button */}
      <button
        onClick={() => onChangePage(currentPage - 1, rowCount, "previous")}
        disabled={currentPage === 1}
        className="w-8 h-8 rounded-full border border-[#EDEDED] text-black disabled:opacity-30 flex items-center justify-center"
      >
        <BiChevronLeft />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onChangePage(pageNumber, rowCount, "number")}
            className={`w-8 h-8 rounded-md border border-[#EDEDED] flex items-center justify-center ${
              currentPage === pageNumber ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onChangePage(currentPage + 1, rowCount, "next")}
        disabled={currentPage === totalPages}
        className="w-8 h-8 rounded-full border border-[#EDEDED] text-black disabled:opacity-30 flex items-center justify-center"
      >
        <BiChevronRight />
        Next
      </button>
    </div>
  );
};

export default CustomPagination;
