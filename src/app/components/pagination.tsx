// "use client"
//
// export default function Pagination(paginationObject:any) {
//     return (
//         <nav aria-label="Page navigation example">
//             <ul className="pagination justify-content-center">
//                 <li className="page-item disabled">
//                     <a className="page-link" href="#" tabIndex={-1}>Previous</a>
//                 </li>
//                 <li className="page-item"><a className="page-link" href="#">1</a></li>
//                 <li className="page-item"><a className="page-link" href="#">2</a></li>
//                 <li className="page-item"><a className="page-link" href="#">3</a></li>
//                 <li className="page-item">
//                     <a className="page-link" href="#">Next</a>
//                 </li>
//             </ul>
//         </nav>
//     );
// }




// import React, { useState, useEffect } from 'react';
//
// interface PaginationProps {
//     currentPage: number;
//     totalPages: number;
//     onPageChange: (page: number) => void;
// }
//
// const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
//     const [pages, setPages] = useState<number[]>([]);
//
//     useEffect(() => {
//         const generatePages = () => {
//             const pageArray: number[] = [];
//             for (let i = 1; i <= totalPages; i++) {
//                 pageArray.push(i);
//             }
//             setPages(pageArray);
//         };
//
//         generatePages();
//     }, [totalPages]);
//
//     return (
//         <nav>
//             <ul className="pagination">
//                 <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                     <button
//                         className="page-link"
//                         onClick={() => onPageChange(currentPage - 1)}
//                     >
//                         Previous
//                     </button>
//                 </li>
//                 {pages.map((page) => (
//                     <li
//                         key={page}
//                         className={`page-item ${currentPage === page ? 'active' : ''}`}
//                     >
//                         <button className="page-link" onClick={() => onPageChange(page)}>
//                             {page}
//                         </button>
//                     </li>
//                 ))}
//                 <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                     <button
//                         className="page-link"
//                         onClick={() => onPageChange(currentPage + 1)}
//                     >
//                         Next
//                     </button>
//                 </li>
//             </ul>
//         </nav>
//     );
// };
//
// export default Pagination;



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
            const pageArray: number[] = [];
            for (let i = 1; i <= totalPages; i++) {
                pageArray.push(i);
            }
            setPages(pageArray);
        };

        generatePages();
    }, [totalPages]);

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