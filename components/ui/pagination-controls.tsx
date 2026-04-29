import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    visiblePages: number[];
    paginationLabel: string;
    onPageChange: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    totalItems: number;
}

export function PaginationControls({
    currentPage,
    totalPages,
    visiblePages,
    paginationLabel,
    onPageChange,
    nextPage,
    prevPage,
    hasPrevPage,
    hasNextPage,
    totalItems,
}: PaginationControlsProps) {
    if (totalPages <= 1 || totalItems === 0) return null;

    return (
        <div className="bg-white border-t-2 border-[#5C5C5C] px-6 py-3 shrink-0 z-20">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="font-display text-base font-normal text-[#676767]">{paginationLabel}</p>

                <div className="flex items-center gap-2">
                    <Button
                        disabled={!hasPrevPage}
                        onClick={prevPage}
                        className="h-11 rounded-xl border-2 border-[#5C5C5C]/10 bg-white font-bold text-[#574272] hover:bg-[#574272] hover:text-white transition-colors"
                    >
                        Previous
                    </Button>

                    {visiblePages.map((num) => (
                        <Button
                            key={num}
                            onClick={() => onPageChange(num)}
                            className={cn(
                                "h-11 w-11 rounded-xl font-bold transition-all",
                                currentPage === num
                                    ? "bg-[#574272] text-white hover:bg-[#574272]"
                                    : "bg-white border-2 border-[#5C5C5C]/10 text-[#574272] hover:bg-[#574272] hover:text-white",
                            )}
                        >
                            {num}
                        </Button>
                    ))}

                    <Button
                        disabled={!hasNextPage}
                        onClick={nextPage}
                        className="h-11 rounded-xl border-2 border-[#5C5C5C]/10 bg-white font-bold text-[#574272] hover:bg-[#574272] hover:text-white transition-colors"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
