'use client'
import React, { useState, useEffect } from 'react';
import {useAppSelector} from "@/redux/hooks/hooks";
import {RootState} from "@/redux/store/store";


interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // const pages = useAppSelector((state: RootState) => state.paginate);

    const [pages, setPages] = useState<number[]>([]);

    useEffect(() => {
        const generatePages = () => {
            const pageArray: number[] = [];
            for (let i = 1; i <= totalPages; i++) {
                pageArray.push(i);
            }
            setPages(pageArray);
        };
        generatePages();
    }, [currentPage]);

    return (
        <nav>
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        Previous
                    </button>
                </li>
                {pages.map((page) => (
                    <li
                        key={page}
                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                    >
                        <button className="page-link" onClick={() => onPageChange(page)}>
                            {page}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;