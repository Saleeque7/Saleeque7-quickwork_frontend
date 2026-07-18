import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center mt-4 p-4 bg-white rounded-md">
      {/* <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="mr-2 p-2 border border-teal-500 rounded disabled:opacity-50 text-teal-500 hover:bg-teal-50 transition-colors"
        aria-label="Previous Page"
      >
        <FaChevronLeft />
      </button> */}
      {pages.map(page => (
        <div
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 px-3 py-1 rounded-md cursor-pointer transition-colors duration-300 font-bold text-lg text-center ${
            currentPage === page
              ? "bg-teal-500 text-white hover:bg-teal-600"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          {page}
        </div>
      ))}
      {/* <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="ml-2 p-2 border border-teal-500 rounded disabled:opacity-50 text-teal-500 hover:bg-teal-50 transition-colors"
        aria-label="Next Page"
      >
        <FaChevronRight />
      </button> */}
    </div>
  );
};
