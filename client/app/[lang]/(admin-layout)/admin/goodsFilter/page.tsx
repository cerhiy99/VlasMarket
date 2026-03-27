'use client';

import AdminHeader from '@/app/components/Admin/AdminHeader/AdminHeader';
import { Locale } from '@/i18n.config';
import React, { use, useEffect, useState } from 'react';
import LeftSVG from '@/app/assest/Admin/Left.svg';
import RightSVG from '@/app/assest/Admin/Right.svg';
import { $authHost, $host } from '@/app/http';
import './GoodsFilter.scss';
import ProductsTable2 from './ProductsTable';
import { useRouter } from 'next/navigation';

const ProductsPage = ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = use(params);
  // Состояния для фильтров и поиска
  const [categoryFilter, setCategoryFilter] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Состояния для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

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
  const getLinia = async () => {
    try {
      const res = await $authHost.get('goods/getLinia');
      setListLinia(res.data);
    } catch (err) {
      alert('Помилка отримання лінії');
    }
  };
  const getRecognition = async () => {
    try {
      const res = await $authHost.get('goods/getRecognition');
      setListRecognition(res.data);
    } catch (err) {
      alert('Помилка отримання призначень.');
    }
  };
  useEffect(() => {
    getCategories();
    getBrends();
    getLinia();
    getRecognition();
  }, []);
  const router = useRouter();
  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push('#filter-container');
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
  const handleManufacturerChange = (value: string | number) => {
    setManufacturerFilter(value.toString());
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтра
  };

  // Обработчик поиска
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
  };
  const [isOk, setIsOk] = useState(false);
  // Обновляем общее количество страниц при обновлении данных
  const updateTotalPages = (totalPages: number) => {
    setTotalPages(totalPages);
  };
  const [article, setArticle] = useState('');
  const [isShow, setIsShow] = useState('all'); //'all' | '1' | '0'
  const [search, setSearch] = useState('');
  const [topBlock, setTopBlock] = useState('');
  const [allProducts, setAllProducts] = useState<any>([]);
  const [countGoods, setCountGoods] = useState<number>(0);
  const getProducts = async () => {
    try {
      let searcurl = `goods/get?inAdmin=true&limit=20&page=${currentPage}`;
      if (categoryFilter) searcurl += `&category=` + categoryFilter;
      if (manufacturerFilter) searcurl += `&brend=` + manufacturerFilter;
      if (article) searcurl += `&article=` + article;
      if (isShow) searcurl += `&isShow=` + isShow;
      if (search) searcurl += `&search=` + search;
      if (topBlock) searcurl += `&${topBlock}=true`;
      if (selectLinia) searcurl += `&linia=${selectLinia}`;
      if (selectRecognition) searcurl += `&recognition=${selectRecognition}`;
      const res = await $host.get(searcurl);
      setCountGoods(res.data.totalGoods);
      const goods = res.data.goods;
      const trueFormGoods = goods.map((x: any) => ({
        realId: x.id,
        volumeFirstId: x.volumes[0].id,
        id: x.volumes.map((x: any) => x.art + ' '),
        name: x.nameru,
        price: x.volumes.map((x: any) => x.priceWithDiscount),
        category: x.category.nameru,
        image: process.env.NEXT_PUBLIC_SERVER + x.volumes[0].imgs[0].img || '',
        manufacturer: x.brend.name,
        updatedAt: x.updatedAt,
        isAvailability: x.volumes.map((x: any) =>
          x.isAvailability == 'inStock'
            ? 'В наличии'
            : x.isAvailability == 'notAvailable'
              ? 'Нет в наличии'
              : 'Под заказ'
        ),
        volume: x.volumes.map((x: any) => x.volume + ' ' + x.nameVolume),
        brend: x.brend.name,
        isShow: x.isShow,
        url: x.volumes[0].url,
      }));
      setAllProducts(trueFormGoods);
      updateTotalPages(res.data.totalPages);
      setSelectGoods([]);
      setIsOk(true);
      setTimeout(() => {
        setIsOk(false);
      }, 2000);
    } catch (err) {
      console.log(err);
      alert('Помилка отримання товару');
    }
  };

  useEffect(() => {
    getProducts();
    setSelectGoods([]);
  }, [currentPage]);

  const [selectGoods, setSelectGoods] = useState<number[]>([]);
  const setCurrentId = (id: number) => {
    setSelectGoods((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const deleteCurrentId = (id: number) => {
    setSelectGoods((prev) => prev.filter((item) => item !== id));
  };
  const setAllGoods = () => {
    if (selectGoods.length == allProducts.length) {
      setSelectGoods([]);
    } else {
      const allGoods = allProducts.map((x: any) => x.realId);
      setSelectGoods(allGoods);
    }
  };
  const del = async (id: number) => {
    try {
      const confirmDelete = window.confirm(
        'Ви впевнені, що хочете видалити товар?\nЦю дію неможливо скасувати.'
      );

      if (!confirmDelete) return;

      // Тут викликаємо запит на видалення
      await $authHost.post(`goods/del/${id}`); // заміни на твій ендпоінт
      getProducts();
      alert('Товар успішно видалено');
    } catch (err) {
      alert('Помилка при видаленні');
      console.log(err);
    }
  };

  const [selectMassOperations, setSelectMassOperations] = useState<
    '' | 'del' | 'notShow' | 'showTrue'
  >('');

  const useMassOperations = async () => {
    try {
      if (!selectMassOperations) return;

      if (selectGoods.length === 0) {
        alert('Сначала выберите товары');
        return;
      }

      const confirmMassAction = window.confirm(
        `Вы уверены, что хотите выполнить массовую операцию "${selectMassOperations}" для выбранных ${selectGoods.length} товаров?`
      );

      if (!confirmMassAction) return;

      if (selectMassOperations === 'del') {
        await $authHost.post(`goods/mass-delete`, { ides: selectGoods });
        alert('✅ Товары успешно удалены');
      } else if (selectMassOperations === 'notShow') {
        await $authHost.post(`goods/mass-hide`, { ides: selectGoods });
        alert('📦 Товары скрыты');
      } else if (selectMassOperations === 'showTrue') {
        await $authHost.post(`goods/mass-show`, { ides: selectGoods });
        alert('📦 Товары опубликованы');
      }

      getProducts();
    } catch (err: any) {
      alert('❌ Ошибка массовой операции. Подробности в консоли.');
      console.error('Массовая операция:', err?.response?.data || err);
    }
  };
  const [listLinia, setListLinia] = useState([]);
  const [listRecognition, setListRecognition] = useState([]);
  const [selectLinia, setSelectLinia] = useState('');
  const [selectRecognition, setSelectRecognition] = useState('');
  const [searchLinia, setSearchLinia] = useState('');
  const [isshowLinia, setISShowLinia] = useState(false);
  const [searchBrend, setSearchBrend] = useState('');
  const [isshowBrend, setISShowBrend] = useState(false);

  return (
    <div>
      <AdminHeader url="/" name="Массовые операции с отображением товаров" lang={lang} />
      <div className="admin-items-container2">
        <div id="filter-container" className="filter-container">
          <h2 style={{ marginTop: 0 }}>Найдено {countGoods}</h2>
          <div className="filters">
            <div className="filter">
              Артикул
              <input
                value={article}
                onChange={(e) => setArticle(e.target.value)}
                placeholder="Артикул"
              />
            </div>
            <div className="filter">
              Опубликован ли товар
              <select onChange={(e) => setIsShow(e.target.value)} value={isShow}>
                <option value="all">Все</option>
                <option value="0">Нет</option>
                <option value="1">Да</option>
              </select>
            </div>
            <div className="filter">
              Заголовок
              <input
                style={{ width: '400px', maxWidth: '100%' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Заголовок"
              />
            </div>
            <div className="filter">
              Линия
              <input
                type="text"
                style={{ width: '150px' }}
                placeholder="Линия"
                onFocus={(e) => setISShowLinia(true)}
                value={searchLinia}
                onChange={(e) => setSearchLinia(e.target.value)}
              />
              {isshowLinia && (
                <div
                  className="dropdown"
                  //value={selectLinia}
                  //onChange={(e) => setSelectLinia(e.target.value)}
                >
                  <div
                    style={{}}
                    onClick={(e) => {
                      setSelectLinia('');
                      setSearchLinia('');
                      setISShowLinia(false);
                    }}
                  >
                    Не вибрано
                  </div>
                  {listLinia
                    .filter((x: any) => x.name.toLowerCase().includes(searchLinia))
                    .map((x: any) => (
                      <div
                        style={{
                          color: selectLinia == x.id ? '#FE680A' : '#000',
                        }}
                        onClick={(e) => {
                          setSelectLinia(x.id);
                          setSearchLinia(x.name);
                          setISShowLinia(false);
                        }}
                        key={x.id}
                      >
                        {x.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
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
              <input
                type="text"
                style={{ width: '150px' }}
                placeholder="Производитель"
                onFocus={(e) => setISShowBrend(true)}
                value={searchBrend}
                onChange={(e) => setSearchBrend(e.target.value)}
              />
              {isshowBrend && (
                <div className="dropdown">
                  <div
                    style={{}}
                    onClick={(e) => {
                      handleManufacturerChange('');
                      setSearchBrend('');
                      setISShowBrend(false);
                    }}
                  >
                    Не вибрано
                  </div>
                  {manufacturers
                    .filter((x: any) => x.name.toLowerCase().includes(searchBrend))
                    .map((x: any) => (
                      <div
                        style={{
                          color: manufacturerFilter == x.id ? '#FE680A' : '#000',
                        }}
                        onClick={(e) => {
                          handleManufacturerChange(x.id);
                          setSearchBrend(x.name);
                          setISShowBrend(false);
                        }}
                        key={x.id}
                      >
                        {x.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className="filter">
              Назначение:
              <select
                value={selectRecognition}
                onChange={(e) => setSelectRecognition(e.target.value)}
              >
                <option value="">Все Назначение</option>
                {listRecognition.map((x: any, index) => (
                  <option key={x.id} value={x.id}>
                    {x.nameru}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter">
              Метки товара
              <select onChange={(e) => setTopBlock(e.target.value)} value={topBlock}>
                <option value="">Все</option>
                <option value="isDiscount">Со скидкой</option>
                <option value="isHit">Топ продажов</option>
                <option value="isNovetly">Новинка</option>
                <option value="isFreeDelivery">Безкоштовна доставка?</option>
              </select>
            </div>
            <button
              onClick={() => {
                setCurrentPage(1);
                getProducts();
              }}
            >
              Фильтровать
            </button>
            <button onClick={() => getProducts()}>Оновить</button>
            {isOk ? (
              <div
                style={{
                  color: 'green',
                  backgroundColor: '#fff',
                  padding: '2px 5px',
                }}
              >
                Оновлено
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      <div id="mass-operations" className="mass-operations">
        <div className="mass-operations-title">Операции</div>
        <div className="row">
          <select
            value={selectMassOperations}
            onChange={(e) =>
              setSelectMassOperations(e.target.value as '' | 'del' | 'notShow' | 'showTrue')
            }
          >
            <option value="">- Виберите действия -</option>
            <option value="del">Удалить</option>
            <option value="notShow">Скрить</option>
            <option value="showTrue">Показать</option>
          </select>
          <button
            className={selectMassOperations && selectGoods.length > 0 ? 'but-active' : ''}
            onClick={useMassOperations}
          >
            Виполнить
          </button>
        </div>
      </div>
      <br />
      <ProductsTable2
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
        allProducts={allProducts}
        selectGoods={selectGoods}
        setCurrentId={setCurrentId}
        deleteCurrentId={deleteCurrentId}
        setAllGoods={setAllGoods}
        del={del}
      />

      {totalPages <= 1 ? (
        <>
          <br />
          <br />
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
