import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
          className={`h-9 w-9 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${
            currentPage === i
              ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20 hover:bg-sky-600"
              : "border-slate-200 text-slate-600 hover:bg-sky-50 hover:text-sky-600"
          }`}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-[#f8fafc] border-t border-slate-100">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        Showing page <span className="text-sky-600">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-10 sm:h-9 rounded-lg px-3 sm:px-4 font-bold text-[10px] uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-sky-50"
        >
          <ChevronLeft className="sm:mr-1 h-3.5 w-3.5" /> <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="hidden md:flex items-center gap-1 mx-2">
            {renderPageNumbers()}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-10 sm:h-9 rounded-lg px-3 sm:px-4 font-bold text-[10px] uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-sky-50"
        >
          <span className="hidden sm:inline">Next</span> <ChevronRight className="sm:ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
