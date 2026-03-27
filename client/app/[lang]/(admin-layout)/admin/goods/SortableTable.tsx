'use client'

import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import './Goods.scss'

import UppSVG from '@/app/assest/Admin/Up.svg'
import Pagination from '@/app/components/utils/Pagination'
import { $authHost } from '@/app/http'

// Определяем правильные типы для наших данных
interface Product {
  id: string | number
  name: string
  today: number
  week: number
  month: number
  year: number
  allTime: number
  [key: string]: any // Позволяет индексировать любой строкой
}

interface SortConfig {
  key: keyof Product | null
  direction: 'ascending' | 'descending' | null
}

// Мемоизированный компонент строки для предотвращения ненужных перерендеров
const ProductRow = memo(
  ({ product, index }: { product: Product; index: number }) => {
    return (
      <div
        className='review'
        style={{
          backgroundColor: index % 2 === 0 ? '#2695691A' : '#A5A1A100'
        }}
      >
        <div className='name'>
          <span className='mobile-label'>Название:</span>
          {product.name}
        </div>
        <div className='time today'>
          <span className='mobile-label'>Сегодня:</span>
          {product.today}
        </div>
        <div className='time week'>
          <span className='mobile-label'>Неделя:</span>
          {product.week}
        </div>
        <div className='time mouth'>
          <span className='mobile-label'>Месяц:</span>
          {product.month}
        </div>
        <div className='time year'>
          <span className='mobile-label'>Год:</span>
          {product.year}
        </div>
        <div className='time all-time'>
          <span className='mobile-label'>Весь период:</span>
          {product.allTime}
        </div>
      </div>
    )
  }
)

// Добавляем отображаемое имя для лучшей отладки
ProductRow.displayName = 'ProductRow'

export default function SortableTable({
  goodsList,
  finishDate,
  search,
  startDate
}: {
  goodsList: Product[]
  finishDate: string
  search: string
  startDate: string
}) {
  const [products, setProducts] = useState<Product[]>(goodsList || [])
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [countPage, setCountPages] = useState(1)

  // Мемоизируем отсортированные продукты, чтобы избежать пересчета при каждом рендере
  const sortedProducts = useMemo(() => {
    const sortableProducts = [...products]

    if (sortConfig.key && sortConfig.direction) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }

    return sortableProducts
  }, [products, sortConfig.key, sortConfig.direction])

  // Используем стабильную функцию обратного вызова для пагинации
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // Мемоизируем getSortDirection, чтобы избежать повторного создания при каждом рендере
  const [sortDirection, getSortDirection] = useState('')

  const renderSortArrow = useCallback(
    (key: keyof Product) => {
      const direction = sortDirection == key
      if (!direction) return <UppSVG className='sort-icon' />
      return <UppSVG className={`sort-icon ${direction ? 'rotated' : ''}`} />
    },
    [sortDirection]
  )

  // Обновляем состояние продуктов, когда изменяется свойство goodsList
  useEffect(() => {
    setCurrentPage(1) // Сброс на первую страницу при изменении данных
  }, [goodsList])
  const getGoods = async () => {
    try {
      let url = `goods/get-views?page=${currentPage}`
      if (startDate) url += `&startDate=${startDate}`
      if (finishDate) url += `&finishDate=${finishDate}`
      if (search) url += `&search=${search}`
      if (sortDirection) url += `&${sortDirection}=true`

      const res = await $authHost.get(url)
      setCountPages(res.data.totalPages)
      setProducts(res.data.data)
      console.log(42343, res)
    } catch (err) {
      alert('error')
      console.log(err)
    }
  }

  useEffect(() => {
    getGoods()
  }, [search, startDate, finishDate, search, currentPage, sortDirection])

  return (
    <div className='list-reviews'>
      <div className='review-header'>
        <div className='name'>Название</div>
        <div
          className={`time today ${sortDirection == 'today' ? `` : ''}`}
          onClick={() => getSortDirection('today')}
        >
          Сегодня {renderSortArrow('today')}
        </div>
        <div
          className={`time week ${sortDirection == 'week' ? `` : ''}`}
          onClick={() => getSortDirection('week')}
        >
          Неделя {renderSortArrow('week')}
        </div>
        <div
          className={`time mouth ${sortDirection == 'month' ? `` : ''}`}
          onClick={() => getSortDirection('month')}
        >
          Месяц {renderSortArrow('month')}
        </div>
        <div
          className={`time year ${sortDirection == 'year' ? `` : ''}`}
          onClick={() => getSortDirection('year')}
        >
          Год {renderSortArrow('year')}
        </div>
        <div
          className={`time all-time ${sortDirection == 'allTime' ? `` : ''}`}
          onClick={() => getSortDirection('allTime')}
        >
          Весь период {renderSortArrow('all-time')}
        </div>
      </div>

      <div className='mobile-sort-controls'>
        <div className='mobile-sort-label'>Сортировать по:</div>
        <select
          onChange={e => getSortDirection(e.target.value as string)}
          value={(sortConfig.key as string) || ''}
        >
          <option value=''>Выберите поле</option>
          <option value='today'>Сегодня</option>
          <option value='week'>Неделя</option>
          <option value='month'>Месяц</option>
          <option value='year'>Год</option>
          <option value='allTime'>Весь период</option>
        </select>

        {sortConfig.key && (
          <select
            onChange={e =>
              setSortConfig({
                key: sortConfig.key,
                direction: e.target.value as 'ascending' | 'descending' | null
              })
            }
            value={sortConfig.direction || ''}
          >
            <option value='ascending'>По возрастанию</option>
            <option value='descending'>По убыванию</option>
          </select>
        )}
      </div>

      {currentPage === 0 ? (
        <div className='review emptyMessage'>Данные отсутствуют</div>
      ) : (
        products.map((product, index) => (
          <ProductRow key={product.id} product={product} index={index} />
        ))
      )}
      <Pagination
        totalItems={products.length}
        itemsPerPage={1}
        countPages={countPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
