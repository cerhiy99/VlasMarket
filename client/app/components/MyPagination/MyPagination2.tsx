// components/Pagination/Pagination.tsx
import Link from 'next/link'
import React from 'react'
import './MyPagination.scss' // Переконайтеся, що шлях до стилів правильний
import { getLocalizedPath } from '../utils/getLocalizedPath'
import { Locale } from '@/i18n.config'
import { usePathname, useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  lang: Locale
  currentSearchParams:any
  currentPathname:any
}

const MyPagination2: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  lang,
  currentPathname,
  currentSearchParams
}) => {

  // Функція для генерації посилання на сторінку з урахуванням усіх вимог
  const generatePageLink = (page: number) => {
    // Створюємо новий об'єкт URLSearchParams
    const params = new URLSearchParams(currentSearchParams)
    
    // Якщо це не перша сторінка, додаємо параметр PAGEN_1 першим
    if (page > 1) {
      params.set('PAGEN_1', String(page))
    }
    else{
      params.delete('PAGEN_1')
    }
    
    // Додаємо всі інші існуючі параметри запиту
    currentSearchParams.forEach((value:any, key:any) => {
      // Використовуємо .getAll, щоб коректно обробляти множинні значення одного ключа (наприклад, ?filter=a&filter=b)
      if (key !== 'PAGEN_1') {
        currentSearchParams.getAll(key).forEach((val:any) => {
          params.append(key, val)
        })
      }
    })

    // Формуємо кінцеве посилання: шлях + оновлені параметри запиту
    const queryString = params.toString()
    return `${currentPathname}${queryString ? `?${queryString}` : ''}`
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5 // Total number of visible page buttons (e.g., 1 2 3 ... 7)
    const boundaryPages = 1 // Number of pages always visible at the start and end (e.g., 1, 7)
    const middlePages = maxVisiblePages - 2 * boundaryPages // Number of pages to show around current page

    // Always show the first page if totalPages > 0
    if (totalPages > 0) {
      pages.push(
        <PaginationItem
          key={1}
          page={1}
          isActive={currentPage === 1}
          href={generatePageLink(1)}
          lang={lang}
        />
      )
    }

    // Determine the range of pages to show around the current page
    let startMiddle = Math.max(
      boundaryPages + 1,
      currentPage - Math.floor(middlePages / 2)
    )
    let endMiddle = Math.min(
      totalPages - boundaryPages,
      currentPage + Math.floor(middlePages / 2)
    )

    // Adjust the middle range if it overlaps with the start or end boundary pages
    if (endMiddle - startMiddle + 1 < middlePages) {
      // If the range is too small
      if (startMiddle <= boundaryPages + 1) {
        // If it's near the beginning
        endMiddle = Math.min(
          totalPages - boundaryPages,
          startMiddle + middlePages - 1
        )
      } else if (endMiddle >= totalPages - boundaryPages) {
        // If it's near the end
        startMiddle = Math.max(boundaryPages + 1, endMiddle - middlePages + 1)
      }
    }

    // Ensure startMiddle doesn't go beyond endMiddle
    if (startMiddle > endMiddle) {
      startMiddle = endMiddle
    }

    // Add ellipsis after the first page if necessary
    if (startMiddle > boundaryPages + 1) {
      pages.push(
        <span key='ellipsis-start' className='pagination-ellipsis'>
          ...
        </span>
      )
    }

    // Add middle pages
    for (let i = startMiddle; i <= endMiddle; i++) {
      // Avoid duplicating the first page if startMiddle happens to be 1
      if (i === 1) continue
      // Avoid duplicating the last page if endMiddle happens to be totalPages
      if (i === totalPages) continue

      pages.push(
        <PaginationItem
          key={i}
          page={i}
          isActive={currentPage === i}
          href={generatePageLink(i)}
          lang={lang}
        />
      )
    }

    // Add ellipsis before the last page if necessary
    if (endMiddle < totalPages - boundaryPages) {
      pages.push(
        <span key='ellipsis-end' className='pagination-ellipsis'>
          ...
        </span>
      )
    }

    // Always show the last page if totalPages > 1 and it hasn't been added yet
    if (
      totalPages > 1 &&
      (pages.length === 0 ||
        parseInt(pages[pages.length - 1].key as string) !== totalPages)
    ) {
      pages.push(
        <PaginationItem
          key={totalPages}
          page={totalPages}
          isActive={currentPage === totalPages}
          href={generatePageLink(totalPages)}
          lang={lang}
        />
      )
    }

    return pages
  }

  return (
    <nav className='pagination-container2' aria-label='Навігація по сторінках'>
      <ul className='pagination-list'>
        {/* Кнопка "Попередня" */}
        {currentPage > 1 && (
          <PaginationItem
            key='prev'
            page='<'
            isActive={false}
            href={generatePageLink(currentPage - 1)}
            lang={lang}
          />
        )}

        {renderPageNumbers()}

        {/* Кнопка "Наступна" */}
        {currentPage < totalPages && (
          <PaginationItem
            key='next'
            page='>'
            isActive={false}
            href={generatePageLink(currentPage + 1)}
            lang={lang}
          />
        )}
      </ul>
    </nav>
  )
}

interface PaginationItemProps {
  page: number | string
  isActive: boolean
  href: string
  lang: Locale
}

const PaginationItem: React.FC<PaginationItemProps> = ({
  page,
  isActive,
  href,
  lang
}) => {
  return (
    <li>
      <Link
        href={getLocalizedPath(href, lang)}
        className={`pagination-item ${isActive ? 'active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {page}
      </Link>
    </li>
  )
}

export default MyPagination2;
