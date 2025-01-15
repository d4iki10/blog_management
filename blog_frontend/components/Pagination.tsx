import React from "react";
import { useRouter } from "next/router";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    basePath,
    }) => {
    const router = useRouter();

    const handlePrevious = () => {
        if (currentPage > 1) {
        router.push(`${basePath}/?page=${currentPage - 1}`);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
        router.push(`${basePath}/?page=${currentPage + 1}`);
        }
    };

    return (
        <div style={paginationStyle}>
            {currentPage > 1 && <button onClick={handlePrevious}>前へ</button>}
            <span>
                Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && <button onClick={handleNext}>次へ</button>}
        </div>
    );
};

const paginationStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    margin: "2rem 0",
};

export default Pagination;
