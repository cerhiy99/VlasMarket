'use client';

import AdminHeader from '@/app/components/Admin/AdminHeader/AdminHeader';
import type { Locale } from '@/i18n.config';
import { useState, useEffect, useCallback, useMemo, use } from 'react';
import './Orders.scss';
import LeftSVG from '@/app/assest/Admin/Left.svg';
import RightSVG from '@/app/assest/Admin/Right.svg';
import SearchSVG from '@/app/assest/Admin/Search.svg';
import Link from 'next/link';
import { $authHost } from '@/app/http';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
// import { ChevronDown, ChevronUp } from 'lucide-react'

interface Order {
  id: number;
  date: string;
  name: string;
  email: string;
  phone: string;
  pib: string;
  contactInfo: string;
  deliveryType: string;
  city: string;
  coment: string;
  sum: string;
  status: string;
  isMenedher: boolean;
  comentMeneger: string;
  basket: any;
}

interface SortConfig {
  key: keyof Order;
  direction: 'ascending' | 'descending';
}

// Исходные данные заказов
const initialOrders = [
  {
    id: 20,
    date: '04.17.2024 | 23:00',
    name: 'Людмила',
    email: 'ludamdfkr@gmail.com',
    phone: '+38(098)821-96-88',
    pib: 'Костенко Наталія Анатоліївна',
    deliveryType: 'Новая Почта',
    city: 'Дніпро',
    coment:
      'Перезаоните для уточнения заказа Нужны цвет синий 12 номер Зеленый 15 номер Ред 10 номер Фиолетовый',
    sum: '1000',
    status: 'Проверка',
    isMenedher: true,
    comentMeneger: '3',
    contactInfo: '',
    basket: '[]',
    isMeneger: true,
  },
];

const ITEMS_PER_PAGE = 5;

const listMassOperation = [
  {
    id: 'wait',
    name: 'В ожидании',
  },
  {
    id: 'check',
    name: 'Проверка',
  },
  {
    id: 'pay',
    name: 'Оплата',
  },
  {
    id: 'nalozhen',
    name: 'Наложка',
  },
  {
    id: 'finish',
    name: 'Завершен',
  },
  {
    id: 'cansel',
    name: 'Отменен',
  },
];

// Order card component for mobile view
const OrderCard = ({
  order,
  isSelected,
  onToggleSelect,
  expandedOrderId,
  setExpandedOrderId,
  isMeneger,
  getOrders,
}: {
  order: Order;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  expandedOrderId: number | null;
  setExpandedOrderId: (id: number | null) => void;
  isMeneger: boolean;
  getOrders: Function;
}) => {
  const isExpanded = expandedOrderId === order.id;

  const setMeneger = async (orderId: number) => {
    try {
      const res = await $authHost.post('order/setToMeneger', { orderId });

      getOrders();
    } catch (err) {
      alert('error');
    }
  };

  return (
    <div className={`order-card ${isSelected ? 'selected' : ''}`}>
      <div className="order-card-header">
        <div className="order-checkbox">
          <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(order.id)} />
        </div>
        <div className="order-id">
          <span className="label">ID:</span> {order.id}
        </div>
        <div className="order-status">
          <span className="status-badge">{order.status}</span>
        </div>
        <button
          className="expand-button"
          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
          aria-label={isExpanded ? 'Collapse order details' : 'Expand order details'}
        >
          {isExpanded ? 'Закрыть' : 'Открыть'}
        </button>
      </div>

      <div className="order-card-summary">
        <div className="order-name">
          <span className="label">Имя:</span> {order.name}
        </div>
        <div className="order-date">
          <span className="label">Дата:</span> {order.date}
        </div>
        <div className="order-sum">
          <span className="label">Сума:</span> {order.sum}
        </div>
      </div>

      {isExpanded && (
        <div className="order-card-details">
          <div className="details-section">
            <h4>Контактна інформація</h4>
            <div className="info-row">
              <span className="label">E-mail:</span> {order.email}
            </div>
            <div className="info-row">
              <span className="label">Телефон:</span> {order.phone}
            </div>
            <div className="info-row">
              <span className="label">Ф.И.О.:</span> {order.pib}
            </div>
          </div>

          <div className="details-section">
            <h4>Доставка</h4>
            <div className="delivery" dangerouslySetInnerHTML={{ __html: order.contactInfo }} />
          </div>

          <div className="details-section">
            <h4>Позиции заказа</h4>
            <div className="order-items">
              {JSON.parse(order.basket).map((x: any) => (
                <div key={x.id} className="order-item">
                  <div className="item-title">{x.nameru}</div>
                  <div className="item-details">
                    <div className="item-price">
                      <span className="label">Цена:</span> {x.volumes[0].priceWithDiscount} грн
                    </div>
                    <div className="item-quantity">
                      <span className="label">Количество:</span> {x.count} шт.
                    </div>
                    <div className="item-total">
                      <span className="label">Сумма:</span>{' '}
                      {x.count * x.volumes[0].priceWithDiscount} грн.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="details-section">
            <h4>Дополнительная информация</h4>
            <div className="info-row">
              <span className="label">Комментарий:</span> {order.coment}
            </div>
            <div className="info-row">
              <span className="label">Менеджер:</span>
              {''}
              <input
                type="checkbox"
                checked={order.isMenedher}
                onClick={() => setMeneger(order.id)}
                readOnly
              />
            </div>
            {order.comentMeneger && (
              <div className="info-row">
                <span className="label">Комментарий менеджера:</span>
                {''}
                {order.comentMeneger}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersPage = ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = use(params);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('1');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(initialOrders.length / ITEMS_PER_PAGE)
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [expandedFilters, setExpandedFilters] = useState<boolean>(false);
  const [selectStatus, setSelectStatus] = useState<string>('wait');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleOrderChange = <K extends keyof Order>(id: number, key: K, value: Order[K]) => {
    /*setFilteredOrders(prev =>
      prev.map(order => (order.id === id ? { ...order, [key]: value } : order))
    )*/
  };
  // Check if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 992);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Функция для сортировки заказов
  const sortOrders = useCallback(
    (id: string) => {},
    []
    /*(key: keyof Order) => {
      let direction: 'ascending' | 'descending' = 'ascending'
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === 'ascending'
      ) {
        direction = 'descending'
      }
      const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1
        return 0
      })
      setFilteredOrders(sortedOrders)
      setSortConfig({ key, direction })
    },
    [filteredOrders, sortConfig]*/
  );

  // Функция для выбора/отмены выбора всех заказов
  const toggleSelectAll = useCallback(
    (isSelected: boolean) => {
      if (isSelected) {
        const currentPageIds = filteredOrders.map((order) => order.id);
        setSelectedOrderIds(currentPageIds);
      } else {
        setSelectedOrderIds([]);
      }
    },
    [currentPage, filteredOrders]
  );

  // Функция для выбора/отмены выбора одного заказа
  const toggleSelectOrder = useCallback((orderId: number) => {
    setSelectedOrderIds((prevSelected) => {
      if (prevSelected.includes(orderId)) {
        return prevSelected.filter((id) => id !== orderId);
      } else {
        return [...prevSelected, orderId];
      }
    });
  }, []);

  // Фильтрация заказов по поисковому запросу, датам и статусу
  useEffect(() => {
    let result = [...initialOrders];
    if (searchTerm) {
      result = result.filter((order) =>
        Object.values(order).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (startDate) {
      const startDateTime = new Date(startDate).getTime();
      result = result.filter((order) => {
        const orderDate = new Date(order.date.split(' | ')[0]).getTime();
        return orderDate >= startDateTime;
      });
    }
    if (endDate) {
      const endDateTime = new Date(endDate).getTime();
      result = result.filter((order) => {
        const orderDate = new Date(order.date.split(' | ')[0]).getTime();
        return orderDate <= endDateTime;
      });
    }
    if (statusFilter !== '1') {
      const statusMap: Record<string, string> = {
        '2': 'В ожидании',
        '3': 'Проверка',
        '4': 'Оплата',
        '5': 'Наложка',
        '6': 'Завершен',
        '7': 'Отменен',
        '8': 'Корзина',
      };
      result = result.filter((order) => order.status === statusMap[statusFilter]);
    }
    //setFilteredOrders(result)
    setCurrentPage(1);
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
  }, [searchTerm, startDate, endDate, statusFilter]);

  // Функция для получения заказов на текущей странице
  const getCurrentPageOrders = useCallback(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  }, [currentPage, filteredOrders]);

  // Функция для изменения страницы
  const changePage = useCallback(
    (page: number) => {
      if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
        // Сбрасываем выбранные заказы при переходе на другую страницу
        setSelectedOrderIds([]);
        // Close any expanded order when changing page
        setExpandedOrderId(null);
      }
    },
    [totalPages]
  );

  // Проверка, выбраны ли все заказы на текущей странице
  const areAllCurrentPageOrdersSelected = useMemo(() => {
    const currentPageIds = getCurrentPageOrders().map((order) => order.id);
    return currentPageIds.length > 0 && currentPageIds.every((id) => selectedOrderIds.includes(id));
  }, [getCurrentPageOrders, selectedOrderIds]);

  const setStatus = async () => {
    try {
      await $authHost.post('order/setStatus', {
        ides: selectedOrderIds,
        status: selectStatus,
      });
      getOrders();
      setSelectedOrderIds([]);
    } catch (err) {
      alert('помилка');
    }
  };

  // Применение массовых операций к выбранным заказам
  const applyBulkAction = useCallback(() => {
    setStatus();
    // Здесь будет логика для выполнения массовых операций
  }, [selectedOrderIds]);

  // Генерация номеров страниц для пагинации
  const generatePageNumbers = useCallback(() => {
    const pageNumbers = [];
    const maxVisiblePages = 6;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Более умная логика для отображения номеров страниц при большом количестве страниц
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
  }, [currentPage, totalPages]);

  // Toggle mobile filters visibility
  const toggleFilters = useCallback(() => {
    setExpandedFilters((prev) => !prev);
  }, []);

  const getOrders = async () => {
    try {
      let url = 'order/getOrders?page=' + currentPage;
      if (filterStatus != 'all') {
        url += `&status=${filterStatus}`;
      }
      if (startDate) {
        url += `&startDate=${startDate}`;
      }
      if (endDate) {
        url += `&finishDate=${endDate}`;
      }
      const res = await $authHost.get(url);
      const trueOrders = res.data.orders.map((x: any) => ({
        id: x.id,
        date: x.createdAt.slice(0, 10),
        name: x.nameUser,
        email: x.email,
        phone: x.phone,
        pib: x.nameUser,
        deliveryType: x.deliveryType,
        city: x.city,
        contactInfo: x.contactInfo,
        sum: x.sum + ' грн.',
        status: listMassOperation.find((j) => j.id == x.status)?.name,
        isMenedher: x.isToMeneger,
        comentMeneger: x.commentMeneger,
        basket: x.basket,
        coment: x.comment,
      }));
      setFilteredOrders(trueOrders);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {}, [orders]);
  useEffect(() => {
    getOrders();
  }, [currentPage, startDate, endDate, filterStatus]);

  const setMeneger = async (orderId: number) => {
    try {
      const res = await $authHost.post('order/setToMeneger', {
        orderId,
      });
      getOrders();
    } catch (err) {
      alert('Помилка');
    }
  };
  const [startBonusDate, setStartBonusDate] = useState<string>('');
  const [finishBonusDate, setFinishBonusDate] = useState<string>('');
  const [bonus, setBonus] = useState('');

  const getBones = async () => {
    try {
      const res = await $authHost.get(
        `order/getBonus?startBonusDate=${startBonusDate}&finishBonusDate=${finishBonusDate}`
      );

      setBonus(Math.ceil(res.data.totalBonus).toString());
    } catch (err) {
      console.log(4234, err);
      alert('Помилка');
    }
  };

  return (
    <div className="orders-container">
      <AdminHeader url="orders" name="Заказы" lang={lang} />
      <div id="orders-header-container" className="orders-header-container">
        <div className="order-header">
          <h3>Всего заказов: {filteredOrders.length}</h3>

          {isMobile && (
            <button className="toggle-filters-btn" onClick={toggleFilters}>
              {expandedFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
            </button>
          )}
          <div className={`filters ${isMobile && !expandedFilters ? 'filters-hidden' : ''}`}>
            <div className="filter-row">
              <div className="start">
                <span className="filter-label">Дата начала:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="finish">
                <span className="filter-label">Дата окончания:</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="filter-row">
              <div className="status">
                <span className="filter-label status__label">Статус заказа:</span>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">Все</option>
                  {listMassOperation.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add" style={{ position: 'relative' }}>
                <Link href={`orders/new-order`} style={{ position: 'absolute', inset: 0 }}></Link>
                Добавить заказ
              </div>
            </div>

            <div className="search">
              <input
                type="text"
                placeholder="Поиск по названию/артикулу товара, номеру телефона, E-mail"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="search-svg">
                <SearchSVG />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bonus-container">
        <div className="bonus">
          <label>Початок</label>
          <input
            value={startBonusDate}
            onChange={(e) => setStartBonusDate(e.target.value)}
            type="date"
          />
          <label>Кінець</label>
          <input
            value={finishBonusDate}
            onChange={(e) => setFinishBonusDate(e.target.value)}
            type="date"
          />
          <button onClick={() => getBones()}>Розрахувати</button>
          {bonus && <p>Бонус: {bonus}</p>}
        </div>
      </div>
      {isMobile && (
        <div className="selects-adn-input">
          <select value={selectStatus} onChange={(e) => setSelectStatus(e.target.value)}>
            {listMassOperation.map((x) => (
              <li key={x.id} value={x.id}>
                {x.name}
              </li>
            ))}
          </select>

          <button onClick={applyBulkAction} disabled={selectedOrderIds.length === 0}>
            Застосувати
          </button>
        </div>
      )}
      {!isMobile && (
        <div className="selects-adn-input">
          <select value={selectStatus} onChange={(e) => setSelectStatus(e.target.value)}>
            {listMassOperation.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>

          <button onClick={applyBulkAction} disabled={selectedOrderIds.length === 0}>
            Застосувати
          </button>
        </div>
      )}

      {isMobile ? (
        <div className="mobile-orders-list">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isSelected={selectedOrderIds.includes(order.id)}
              onToggleSelect={toggleSelectOrder}
              expandedOrderId={expandedOrderId}
              setExpandedOrderId={setExpandedOrderId}
              isMeneger={order.isMenedher}
              getOrders={getOrders}
            />
          ))}

          {filteredOrders.length === 0 && (
            <div className="no-orders">Нет заказов для отображения</div>
          )}
        </div>
      ) : (
        <div className="list-reviews">
          <div id="review-header" className="review review-header">
            <input
              type="checkbox"
              checked={areAllCurrentPageOrdersSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            <div className="id" onClick={() => sortOrders('id')}>
              ID {sortConfig?.key === 'id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </div>
            <div className="date" onClick={() => sortOrders('date')}>
              Дата{' '}
              {sortConfig?.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </div>
            <div className="email" onClick={() => sortOrders('email')}>
              E-mail{' '}
              {sortConfig?.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </div>
            <div className="contact-info">Контактная информация</div>
            <div className="order-list-basket">Позиции заказа</div>
            <div className="sum">Сума</div>
            <div className="status" onClick={() => sortOrders('status')}>
              Статус{' '}
              {sortConfig?.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </div>
            <div className="meneger">Менеджер</div>
            {
              //<div className='coment-meneger'>Комментарий менеджера</div>
            }{' '}
            <div className="deystvia">Действия</div>
          </div>
          {filteredOrders.map((order: any, index) => (
            <div
              className={`review ${selectedOrderIds.includes(order.id) ? 'selected' : ''}`}
              style={{
                backgroundColor: index % 2 == 0 ? '#2695691A' : '#A5A1A100',
              }}
              key={order.id}
            >
              <input
                type="checkbox"
                checked={selectedOrderIds.includes(order.id)}
                onChange={() => toggleSelectOrder(order.id)}
              />
              <div className="id">{order.id}</div>
              <div className="date">{order.date}</div>
              <div className="email">{order.email}</div>
              <div className="contact-info">
                <div className="info" dangerouslySetInnerHTML={{ __html: order.contactInfo }} />
              </div>
              <div className="order-list-basket">
                <div className="order-list-basket-header">
                  <div className="title">Заголовок</div>
                  <div className="price-with-one">Цена из шт.</div>
                  <div className="count">Кол-во</div>
                  <div className="sum">Сумма</div>
                </div>
                <div className="list-basket">
                  {JSON.parse(order.basket).map((x: any) => (
                    <div className="one-basket" key={x.id}>
                      <div className="title">{x.nameru}</div>{' '}
                      <div className="price-with-one">{x.volumes[0].priceWithDiscount} грн.</div>
                      <div className="count">{x.count}</div>
                      <div className="sum">{x.count * x.volumes[0].priceWithDiscount} грн.</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sum">{order.sum}</div>
              <div className="status">{order.status}</div>
              <div className="meneger">
                <input
                  type="checkbox"
                  checked={order.isMenedher}
                  onChange={() => {
                    handleOrderChange(order.id, 'isMenedher', !order.isMenedher);
                    setMeneger(order.id);
                  }}
                />
              </div>
              {/*<div className='coment-meneger'>
                <textarea defaultValue={order.comentMeneger} />
              </div>*/}
              <div className="deystvia">
                <Link href={getLocalizedPath(`/${lang}/admin/orders/edit-order/${order.id}`, lang)}>
                  <button>Редактировать</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages <= 1 ? (
        <>
          <br />
          <br />
          <br />
        </>
      ) : (
        <div className="pagination">
          <div
            className={`left ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => changePage(currentPage - 1)}
          >
            <LeftSVG />
          </div>
          {generatePageNumbers().map((pageNum) => (
            <Link
              key={pageNum}
              className={`number ${pageNum === currentPage ? 'select' : ''}`}
              onClick={() => changePage(pageNum)}
              href={'#orders-header-container'}
            >
              {pageNum}
            </Link>
          ))}
          <div
            className={`right ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => changePage(currentPage + 1)}
          >
            <RightSVG />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
