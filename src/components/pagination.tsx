'use client'
import React, { useState, useEffect } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const [pages, setPages] = useState<number[]>([]);

    useEffect(() => {
        const generatePages = () => {
            const pageArray: (number | string)[] = [];
            const delta = 2; // Number of pages to show around the current page
            const range = [];

            for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
                range.push(i);
            }

            // Adding the first page
            if (range[0] > 3) {
                range.unshift('...');
            }
            range.unshift(1);

            // Adding the last page
            if (parseFloat(String(range[range.length - 1])) < totalPages - 1) {
                range.push('...');
            }
            if (totalPages > 1) {
                range.push(totalPages);
            }

            setPages(range as number[]);
        };
        generatePages();
    }, [currentPage, totalPages]);

    return (
        <nav>
            <ul className="ebs-pagination list-inline">
                <li className={`list-inline-item page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className='ebs-prev-next'
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                </li>
                {pages.map((page, index) => (
                    <li
                        key={index}
                        className={`list-inline-item page-item ${currentPage === page ? 'active' : ''}`}
                    >
                        {typeof page === 'number' ? (
                            <button onClick={() => onPageChange(page)}>
                                {page}
                            </button>
                        ) : (
                            <span className="ellipsis">...</span>
                        )}
                    </li>
                ))}
                <li className={`list-inline-item page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className='ebs-prev-next'
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
