'use client'
import { useState, useEffect } from 'react'
import Left from '@/app/assest/Admin/Left.svg'
import Right from '@/app/assest/Admin/Right.svg'
import './Pagination.scss'

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage?: number
  onPageChange?: (page: number) => void
  countPages?: number
}

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage: externalCurrentPage,
  onPageChange,
  countPages
}: PaginationProps) => {
  const totalPages = Math.ceil(
    countPages ? countPages : totalItems / itemsPerPage
  )
  const [internalCurrentPage, setInternalCurrentPage] = useState(1)

  // Use either controlled or uncontrolled state for current page
  const currentPage =
    externalCurrentPage !== undefined
      ? externalCurrentPage
      : internalCurrentPage

  // Reset to page 1 if totalItems or itemsPerPage changes
  useEffect(() => {
    if (!externalCurrentPage) {
      setInternalCurrentPage(1)
    }
  }, [totalItems, itemsPerPage, externalCurrentPage])

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (onPageChange) {
        // Controlled component - parent handles page state
        onPageChange(page)
      } else {
        // Uncontrolled component - handle state internally
        setInternalCurrentPage(page)
      }
    }
  }

  const renderPageNumbers = () => {
    if (totalPages <= 1) {
      return [1]
    }

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, '...', totalPages]
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ]
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages
    ]
  }

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className='pagination'>
      <div
        className={`left ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => handlePageClick(currentPage - 1)}
      >
        <Left />
      </div>
      {renderPageNumbers().map((page, index) => (
        <div
          key={index}
          className={`number ${page === currentPage ? 'select' : ''} ${typeof page !== 'number' ? 'ellipsis' : ''}`}
          onClick={() => typeof page === 'number' && handlePageClick(page)}
        >
          {page}
        </div>
      ))}
      <div
        className={`right ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => handlePageClick(currentPage + 1)}
      >
        <Right />
      </div>
    </div>
  )
}

export default Pagination
