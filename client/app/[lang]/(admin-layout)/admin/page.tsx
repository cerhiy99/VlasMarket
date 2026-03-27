'use client';

import AdminHeader from '@/app/components/Admin/AdminHeader/AdminHeader';
import { Locale } from '@/i18n.config';
import React, { use, useEffect, useState } from 'react';
import SearchSVG from '@/app/assest/Admin/Search.svg';
import LeftSVG from '@/app/assest/Admin/Left.svg';
import RightSVG from '@/app/assest/Admin/Right.svg';
import ProductsTable from '@/app/components/Admin/products/ProductsTable';
import { $host } from '@/app/http';

const ProductsPage = ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = use(params);
  // Состояния для фильтров и поиска
  const [categoryFilter, setCategoryFilter] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Состояния для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [countProducts, setCountProducts] = useState(0);

  // Состояние для сортировки
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Состояние для выбранных товаров
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  // Предполагаемые списки категорий и производителей для фильтров
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const getCategories = async () => {
    try {
      const res = await $host.get('category/get');
      setCategories(res.data.res);
    } catch (err) {
      alert('помилка отримати категорії');
      console.log('помилка отримати категорії ' + err);
    }
  };
  const getBrends = async () => {
    try {
      const res = await $host.get('brend/get');
      setManufacturers(res.data);
    } catch (err) {
      alert('Помилка отримання брендів');
      console.log('Помилка отримання брендів' + err);
    }
  };
  useEffect(() => {
    getCategories();
    getBrends();
  }, []);

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedProductIds([]); // Сбрасываем выбранные товары при смене страницы
  };

  // Генерация номеров страниц для пагинации
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 6;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Логика для отображения номеров страниц при большом количестве страниц
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Обработчик выбора категории
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтра
  };

  // Обработчик выбора производителя
  const handleManufacturerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setManufacturerFilter(e.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтра
  };

  // Обработчик поиска
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
  };

  // Обновляем общее количество страниц при обновлении данных
  const updateTotalPages = (filteredCount: number) => {
    setTotalPages(Math.ceil(filteredCount / itemsPerPage));
  };

  return (
    <div>
      <AdminHeader url="/" name="Товары (видимые на сайте)" lang={lang} />
      <div className="admin-items-container">
        <div className="filter-container">
          <div className="searchProduct">Найдено {countProducts}</div>

          <div className="filters">
            <div className="select filter">
              Категории:
              <select value={categoryFilter} onChange={handleCategoryChange}>
                <option value="">Все категории</option>
                {categories.map((category: any, index) => (
                  <option key={index} value={category.id}>
                    {category.nameru}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter">
              Производитель:
              <select value={manufacturerFilter} onChange={handleManufacturerChange}>
                <option value="">Все производители</option>
                {manufacturers.map((manufacturer: any, index) => (
                  <option key={index} value={manufacturer.id}>
                    {manufacturer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-items-search">
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="search-svg">
                <SearchSVG />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductsTable
        setCountProduct={setCountProducts}
        categoryFilter={categoryFilter}
        manufacturerFilter={manufacturerFilter}
        searchTerm={searchTerm}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        selectedProductIds={selectedProductIds}
        setSelectedProductIds={setSelectedProductIds}
        updateTotalPages={updateTotalPages}
      />

      {totalPages <= 1 ? (
        <>
          <br />
          <br />
        </>
      ) : (
        <div className="pagination">
          <div
            className={`left ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          >
            <LeftSVG />
          </div>
          {generatePageNumbers().map((pageNum) => (
            <div
              key={pageNum}
              className={`number ${pageNum === currentPage ? 'select' : ''}`}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </div>
          ))}
          <div
            className={`right ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          >
            <RightSVG />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
