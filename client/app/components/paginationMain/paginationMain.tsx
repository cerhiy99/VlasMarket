import Link from 'next/link'
import styles from './Pagination.module.scss'
import RightSVG from '../../assest/Pagination.svg'
import LeftSVG from '../../assest/Left.svg'
import { getLocalizedPath } from '../utils/getLocalizedPath'
import { Locale } from '@/i18n.config'

interface PaginationProps {
  currentPage: number
  totalPages: number
  url: string
  showPages?: number
  queryParams: any
  lang:Locale
}

const PaginationMain: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  url,
  showPages = 2,
  queryParams,
  lang
}) => {
  const adjacentPages = Math.min(showPages, totalPages)
  const startPage = Math.max(1, currentPage - Math.floor(adjacentPages / 2))
  const endPage = Math.min(totalPages, startPage + adjacentPages)

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  )

  // Створюємо рядок з параметрами запиту
  const queryParamsString = new URLSearchParams(queryParams).toString()

  // Генеруємо посилання з параметрами запиту
  const generateLink = (page: number) =>
    `${url}${page}${queryParamsString ? `?${queryParamsString}` : ''}`

  return (
    <div className={styles.pagination}>
      {/* Посилання на попередню сторінку */}
      <Link
        href={getLocalizedPath(generateLink(currentPage - 1 == 0 ? 1 : currentPage - 1),lang)}
        passHref
      >
        <div className={styles.paginationItem}>
          <LeftSVG />
        </div>
      </Link>

      {/* Виведення сторінок перед поточною */}
      {startPage > 1 && (
        <>
          <Link href={getLocalizedPath(generateLink(1),lang)} passHref>
            <div className={styles.paginationItem}>1</div>
          </Link>
          {startPage > 2 && <div className={styles.paginationItem}>...</div>}
        </>
      )}

      {/* Вивід поточних сторінок */}
      {pages.map(pageNumber => (
        <Link key={pageNumber} href={getLocalizedPath(generateLink(pageNumber),lang)} passHref>
          <div
            className={`${styles.paginationItem} ${
              pageNumber === currentPage ? styles.active : ''
            }`}
          >
            {pageNumber}
          </div>
        </Link>
      ))}

      {/* Виведення сторінок після поточної */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <div className={styles.paginationItem}>...</div>
          )}
          <Link href={getLocalizedPath(generateLink(totalPages),lang)} passHref>
            <div className={styles.paginationItem}>{totalPages}</div>
          </Link>
        </>
      )}

      <Link
        href={getLocalizedPath(generateLink(
          currentPage + 1 > totalPages ? currentPage : currentPage + 1
        ),lang)}
        passHref
      >
        <div className={styles.paginationItem}>
          <RightSVG />
        </div>
      </Link>
    </div>
  )
}

export default PaginationMain
