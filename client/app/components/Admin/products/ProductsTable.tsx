'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './ProductsTable.scss';
import { $authHost, $host } from '@/app/http';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Типы для props компонента
interface Product {
  id: number;
  name: string;
  price: string;
  manufacturer: string;
  category: string;
  image: string;
  realId: number;
  volumeId: number;
  url: string;
}

interface EnhancedProductsTableProps {
  categoryFilter: string;
  manufacturerFilter: string;
  searchTerm: string;
  sortConfig: {
    key: string;
    direction: 'ascending' | 'descending';
  } | null;
  setSortConfig: (
    config: { key: string; direction: 'ascending' | 'descending' } | null,
  ) => void;
  currentPage: number;
  itemsPerPage: number;
  selectedProductIds: number[];
  setSelectedProductIds: (ids: number[]) => void;
  updateTotalPages: (count: number) => void;
  setCountProduct: any;
}

export default function EnhancedProductsTable({
  categoryFilter,
  manufacturerFilter,
  searchTerm,
  sortConfig,
  setSortConfig,
  currentPage,
  itemsPerPage,
  selectedProductIds,
  setSelectedProductIds,
  updateTotalPages,
  setCountProduct,
}: EnhancedProductsTableProps) {
  // Исходные данные о товарах
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const getGoods = async () => {
    try {
      let searcurl = `goods/get?limit=20&page=${currentPage}`;
      if (categoryFilter) searcurl += `&category=` + categoryFilter;
      if (manufacturerFilter) searcurl += `&brend=` + manufacturerFilter;
      if (searchTerm) searcurl += `&search=${searchTerm}`;
      const res = await $authHost.get(searcurl);
      const goods = res.data.goods;
      const trueFormGoods = goods.map((x: any) => ({
        realId: x.id,
        id: x.volumes.map((x: any) => x.art + ' '),
        name: x.nameru,
        price: x.volumes[0].priceWithDiscount,
        category: x.category.nameru,
        image: process.env.NEXT_PUBLIC_SERVER + x.volumes[0].imgs[0].img || '',
        manufacturer: x.brend.name,
        volumeId: x.volumes[0].id,
        url: x.volumes[0].url,
      }));
      setAllProducts(trueFormGoods);
      updateTotalPages(res.data.totalGoods);
      setCountProduct(res.data.totalGoods);
    } catch (err) {
      console.log(err);
      alert('Помилка отримання товару');
    }
  };
  useEffect(() => {
    getGoods();
  }, [currentPage, categoryFilter, manufacturerFilter, searchTerm]);

  // Состояние для отфильтрованных и отсортированных товаров
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  // Состояние для товаров на текущей странице
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

  // Функция для применения фильтрации и сортировки
  useEffect(() => {
    let result = [...allProducts];

    if (categoryFilter) {
      result = result.filter((product) => product.category === categoryFilter);
    }

    if (manufacturerFilter) {
      result = result.filter(
        (product) => product.manufacturer === manufacturerFilter,
      );
    }

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTermLower) ||
          product.id.toString().includes(searchTermLower) ||
          product.manufacturer.toLowerCase().includes(searchTermLower) ||
          product.category.toLowerCase().includes(searchTermLower),
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        // This is now properly typed because sortConfig.key is restricted to keyof Product
        if (
          a[sortConfig.key as keyof Product] <
          b[sortConfig.key as keyof Product]
        ) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (
          a[sortConfig.key as keyof Product] >
          b[sortConfig.key as keyof Product]
        ) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProducts(result);
  }, [
    allProducts,
    categoryFilter,
    manufacturerFilter,
    searchTerm,
    sortConfig,
    updateTotalPages,
  ]);

  // Функция для сортировки по клику на заголовок колонки
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
  };

  // Получение класса для иконки сортировки
  const getSortDirectionIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  // Функция для выбора/отмены выбора всех товаров
  const toggleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const currentPageIds = displayedProducts.map((product) => product.id);
      setSelectedProductIds(currentPageIds);
    } else {
      setSelectedProductIds([]);
    }
  };

  // Проверка, выбраны ли все товары на текущей странице
  const areAllProductsSelected = () => {
    return (
      displayedProducts.length > 0 &&
      displayedProducts.every((product) =>
        selectedProductIds.includes(product.id),
      )
    );
  };
  const router = useRouter();

  return (
    <div className="product-table-container">
      <div className="table-responsive">
        <table className="product-table">
          <thead className="desktop-only">
            <tr>
              <th onClick={() => requestSort('id')}>
                Артикул {getSortDirectionIcon('id')}
              </th>
              <th>Фото товара</th>
              <th onClick={() => requestSort('name')}>
                Название товара {getSortDirectionIcon('name')}
              </th>
              <th onClick={() => requestSort('price')}>
                Цена {getSortDirectionIcon('price')}
              </th>
              <th onClick={() => requestSort('manufacturer')}>
                Производитель {getSortDirectionIcon('manufacturer')}
              </th>
              <th onClick={() => requestSort('category')}>
                Категория {getSortDirectionIcon('category')}
              </th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((product, index) => (
              <tr
                key={product.id}
                className={`${index % 2 === 1 ? 'alternate-row' : ''} ${
                  selectedProductIds.includes(product.id) ? 'selected-row' : ''
                }`}
              >
                <td
                  className="art"
                  data-label="Артикул"
                  dangerouslySetInnerHTML={{
                    __html: product.id
                      .toString()
                      .replace(' ', '<br/>')
                      .replace(',', ''),
                  }}
                />
                <td className="product-image" data-label="Фото товара">
                  <Image
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    width={80}
                    height={80}
                  />
                </td>
                <td className="product-name" data-label="Название товара">
                  <a href={`/ru/goods/${product.url}`}>{product.name}</a>
                </td>
                <td data-label="Цена">{product.price}</td>
                <td data-label="Производитель">{product.manufacturer}</td>
                <td data-label="Категория">{product.category}</td>
                <td data-label="Действия">
                  <Link
                    href={`/ru/admin/update-product/${product.realId}`}
                    target="_blank"
                  >
                    <button className="edit-button">Редактировать</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
