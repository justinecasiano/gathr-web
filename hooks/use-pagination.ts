import { useState, useMemo } from "react";

interface UsePaginationProps<T> {
    items: T[];
    itemsPerPage: number;
    maxVisiblePages?: number;
}

export function usePagination<T>({ items, itemsPerPage, maxVisiblePages = 4 }: UsePaginationProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const currentItems = useMemo(() => {
        return items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [items, currentPage, itemsPerPage]);

    const visiblePages = useMemo(() => {
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return Array.from({ length: Math.max(0, endPage - startPage + 1) }, (_, i) => startPage + i);
    }, [currentPage, totalPages, maxVisiblePages]);

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, items.length);
    const paginationLabel = `Showing ${startIndex}-${endIndex} of ${items.length}`;

    return {
        currentPage,
        setCurrentPage,
        currentItems,
        totalPages,
        visiblePages,
        paginationLabel,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        nextPage: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
        prevPage: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
    };
}
