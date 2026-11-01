import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className = ""
}) {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);

  // Calculate start & end item indexes
  const startItem = totalItems > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // Number of pages to show around current page

    for (let i = 1; i <= safeTotalPages; i++) {
      if (
        i === 1 ||
        i === safeTotalPages ||
        (i >= safeCurrentPage - delta && i <= safeCurrentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`p-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 select-none ${className}`}
    >
      {/* Left: Summary text & Optional Page Size */}
      <div className="flex flex-wrap items-center gap-3">
        {totalItems > 0 ? (
          <span>
            Showing <strong className="text-slate-900">{startItem}</strong> to{" "}
            <strong className="text-slate-900">{endItem}</strong> of{" "}
            <strong className="text-slate-900">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Showing <strong className="text-slate-900">0</strong> entries
          </span>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
            <span className="text-[11px] text-slate-500">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#1E3A8A]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Navigation Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          type="button"
          disabled={safeCurrentPage <= 1}
          onClick={() => onPageChange(1)}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-600"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          disabled={safeCurrentPage <= 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-700 font-semibold flex items-center gap-1"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-xs">Prev</span>
        </button>

        {/* Page Number Buttons (Hidden on tiny mobile screens) */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 font-bold">
                ...
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition-all ${
                  safeCurrentPage === p
                    ? "bg-[#1E3A8A] text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Mobile current page indicator */}
        <span className="sm:hidden px-2 font-bold text-xs text-slate-800">
          {safeCurrentPage} / {safeTotalPages}
        </span>

        {/* Next Page */}
        <button
          type="button"
          disabled={safeCurrentPage >= safeTotalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-700 font-semibold flex items-center gap-1"
          title="Next Page"
        >
          <span className="hidden sm:inline text-xs">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          disabled={safeCurrentPage >= safeTotalPages}
          onClick={() => onPageChange(safeTotalPages)}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-600"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

