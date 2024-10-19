import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
  homesPerPage: number;
  totalHomes: number | undefined;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination = ({
  homesPerPage,
  totalHomes,
  paginate,
  currentPage,
}: PaginationProps) => {
  const pageNumbers = [];

  if (!totalHomes) {
    return null;
  }

  const totalPages = Math.ceil(totalHomes / homesPerPage);

  if (totalPages <= 6) {
    // Show all pages if total pages are 6 or less
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Show the first, last, current, and surrounding pages
    if (currentPage <= 3) {
      // Show the first 4 pages and "..." at the end
      pageNumbers.push(1, 2, 3, 4);
      pageNumbers.push("...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Show "..." at the beginning and the last 4 pages
      pageNumbers.push(1, "...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show "..." on both sides of the current page
      pageNumbers.push(1, "...");
      pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
      pageNumbers.push("...", totalPages);
    }
  }

  return (
    <ShadcnPagination className="">
      <PaginationPrevious
        className="cursor-pointer"
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
      />
      <PaginationContent>
        {pageNumbers.map((number, index) =>
          number === "..." ? (
            <PaginationEllipsis key={`ellipsis-${index}`} />
          ) : (
            <PaginationItem key={number}>
              <PaginationLink
                className="cursor-pointer"
                isActive={number === currentPage}
                onClick={() => paginate(number as number)}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          )
        )}
      </PaginationContent>
      <PaginationNext
        className="cursor-pointer"
        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
      />
    </ShadcnPagination>
  );
};

export default Pagination;
