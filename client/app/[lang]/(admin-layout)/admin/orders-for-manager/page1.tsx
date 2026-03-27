'use client'

const initialOrders = [
  {
    id: 20,
    date: '04.17.2024 | 23:00',
    name: 'Людмила',
    email: 'ludamdfkr@gmail.com',
    phone: '+38(098)821-96-88',
    pib: 'Костенко Наталія Анатоліївна',
    deliveryType: 'Новая Почта',
    oblast: 'Дніпропетровська область',
    city: 'Дніпро',
    department: '58',
    coment:
      'Перезаоните для уточнения заказа Нужны цвет синий 12 номер Зеленый 15 номер Ред 10 номер Фиолетовый',
    sum: '1000',
    status: 'Проверка',
    isMenedher: true,
    author: 'admin',
    comentMeneger: '100 грн.'
  },
  {
    id: 19,
    date: '04.17.2024 | 23:00',
    name: 'Людмила',
    email: 'ludamdfkr@gmail.com',
    phone: '+38(098)821-96-88',
    pib: 'Костенко Наталія Анатоліївна',
    deliveryType: 'Новая Почта',
    oblast: 'Дніпропетровська область',
    city: 'Дніпро',
    department: '58',
    coment:
      'Перезаоните для уточнения заказа Нужны цвет синий 12 номер Зеленый 15 номер Ред 10 номер Фиолетовый',
    sum: '1000',
    status: 'Все оформленные',
    isMenedher: true,
    author: 'admin',
    comentMeneger: '100 грн.'
  },
  {
    id: 18,
    date: '04.17.2024 | 23:00',
    name: 'Людмила',
    email: 'ludamdfkr@gmail.com',
    phone: '+38(098)821-96-88',
    pib: 'Костенко Наталія Анатоліївна',
    deliveryType: 'Новая Почта',
    oblast: 'Дніпропетровська область',
    city: 'Дніпро',
    department: '58',
    coment:
      'Перезаоните для уточнения заказа Нужны цвет синий 12 номер Зеленый 15 номер Ред 10 номер Фиолетовый',
    sum: '1000',
    status: 'Проверка',
    isMenedher: true,
    author: 'admin',
    comentMeneger: '100 грн.'
  },
  {
    id: 17,
    date: '04.17.2024 | 23:00',
    name: 'Людмила',
    email: 'ludamdfkr@gmail.com',
    phone: '+38(098)821-96-88',
    pib: 'Костенко Наталія Анатоліївна',
    deliveryType: 'Новая Почта',
    oblast: 'Дніпропетровська область',
    city: 'Дніпро',
    department: '58',
    coment:
      'Перезаоните для уточнения заказа Нужны цвет синий 12 номер Зеленый 15 номер Ред 10 номер Фиолетовый',
    sum: '1000',
    status: 'Все оформленные',
    isMenedher: true,
    author: 'admin',
    comentMeneger: '100 грн.'
  },
  {
    id: 16,
    date: '04.17.2024 | 23:00',
    name: 'Людмила',
    email: 'ludamdfkr@gmail.com',
    phone: '+38(098)821-96-88',
    pib: 'Костенко Наталія Анатоліївна',
    deliveryType: 'Новая Почта',
    oblast: 'Дніпропетровська область',
    city: 'Дніпро',
    department: '58',
    coment:
      'Перезаоните для уточнения заказа Нужны цвет синий 12 номер Зеленый 15 номер Ред 10 номер Фиолетовый',
    sum: '1000',
    status: 'Все оформленные',
    isMenedher: true,
    author: 'admin',
    comentMeneger: '100 грн.'
  },

  {
    id: 1,
    date: '04.17.2024 | 23:00',
    name: 'Костенко Наталія Анатоліївна',
    email: 'ludamdfkr@gmail.com',
    phone: '+38(098)821-96-88',
    pib: 'Костенко Наталія Анатоліївна',
    deliveryType: 'Нова Пошта',
    oblast: 'Дніпропетровська область',
    city: 'Дніпро',
    department: '58',
    coment:
      'Перезателефонуйте для уточнення замовлення. Потрібні кольори: синій 12 розмір, зелений 15 розмір, червоний 10 розмір, фіолетовий',
    sum: '1000',
    status: 'Все оформленные',
    isMenedher: true,
    author: 'admin',
    comentMeneger: '100 грн.'
  },
  {
    id: 2,
    date: '05.02.2024 | 14:30',
    name: 'Петренко Олександр Ігорович',
    email: 'petrenko.alex@gmail.com',
    phone: '+38(066)123-45-67',
    pib: 'Петренко Олександр Ігорович',
    deliveryType: 'Укрпошта',
    oblast: 'Київська область',
    city: 'Київ',
    department: '12',
    coment: 'Термінова доставка. Додатково упакувати.',
    sum: '2450',
    status: 'Завершен',
    isMenedher: false,
    author: 'manager1',
    comentMeneger: ''
  },
  {
    id: 3,
    date: '06.15.2024 | 10:45',
    name: 'Шевченко Ірина Володимирівна',
    email: 'shevchenko.iryna@ukr.net',
    phone: '+38(050)987-65-43',
    pib: 'Шевченко Ірина Володимирівна',
    deliveryType: 'Нова Пошта',
    oblast: 'Львівська область',
    city: 'Львів',
    department: '33',
    coment: 'Замовлення подарункове, додати вітальну листівку',
    sum: '1780',
    status: 'Оплата',
    isMenedher: true,
    author: 'admin',
    comentMeneger: 'Додано подарункову упаковку'
  },
  {
    id: 4,
    date: '07.22.2024 | 18:20',
    name: 'Ковальчук Андрій Миколайович',
    email: 'kovalchuk.andriy@gmail.com',
    phone: '+38(093)456-78-90',
    pib: 'Ковальчук Андрій Миколайович',
    deliveryType: 'Самовивіз',
    oblast: 'Одеська область',
    city: 'Одеса',
    department: '',
    coment: 'Зателефонувати перед приїздом',
    sum: '3200',
    status: 'Завершен',
    isMenedher: false,
    author: 'manager2',
    comentMeneger: 'Клієнт забрав'
  },
  {
    id: 5,
    date: '08.10.2024 | 11:15',
    name: 'Мельник Вікторія Сергіївна',
    email: 'melnyk.vika@yahoo.com',
    phone: '+38(067)345-67-89',
    pib: 'Мельник Вікторія Сергіївна',
    deliveryType: 'Нова Пошта',
    oblast: 'Харківська область',
    city: 'Харків',
    department: '45',
    coment: 'Замовити додаткову упаковку',
    sum: '1560',
    status: 'Все оформленные',
    isMenedher: true,
    author: 'admin',
    comentMeneger: 'Додаткова упаковка 50 грн.'
  },
  {
    id: 6,
    date: '09.05.2024 | 16:40',
    name: 'Сидоренко Максим Олегович',
    email: 'sidorenko.max@gmail.com',
    phone: '+38(063)234-56-78',
    pib: 'Сидоренко Максим Олегович',
    deliveryType: 'Укрпошта',
    oblast: 'Запорізька область',
    city: 'Запоріжжя',
    department: '22',
    coment: 'Замовлення для бізнесу, потрібен рахунок',
    sum: '5430',
    status: 'Завершен',
    isMenedher: true,
    author: 'manager1',
    comentMeneger: 'Рахунок Оплата'
  },
  {
    id: 7,
    date: '03.14.2024 | 20:25',
    name: 'Бондаренко Юлія Василівна',
    email: 'bondarenko.yulia@ukr.net',
    phone: '+38(096)765-43-21',
    pib: 'Бондаренко Юлія Василівна',
    deliveryType: 'Нова Пошта',
    oblast: 'Вінницька область',
    city: 'Вінниця',
    department: '17',
    coment: 'Кольори: чорний, розмір M',
    sum: '890',
    status: 'Оплата',
    isMenedher: false,
    author: 'manager2',
    comentMeneger: ''
  },
  {
    id: 8,
    date: '07.05.2024 | 13:50',
    name: 'Лисенко Артем Валерійович',
    email: 'lysenko.artem@gmail.com',
    phone: '+38(050)876-54-32',
    pib: 'Лисенко Артем Валерійович',
    deliveryType: 'Самовивіз',
    oblast: 'Полтавська область',
    city: 'Полтава',
    department: '',
    coment: 'Дзвонити з 14:00 до 18:00',
    sum: '2100',
    status: 'Завершен',
    isMenedher: true,
    author: 'admin',
    comentMeneger: 'Клієнт задоволений'
  },
  {
    id: 9,
    date: '05.28.2024 | 10:30',
    name: 'Павленко Оксана Іванівна',
    email: 'pavlenko.oksana@yahoo.com',
    phone: '+38(067)654-32-10',
    pib: 'Павленко Оксана Іванівна',
    deliveryType: 'Нова Пошта',
    oblast: 'Черкаська область',
    city: 'Черкаси',
    department: '9',
    coment: 'Потрібен подарунковий сертифікат',
    sum: '1250',
    status: 'Все оформленные',
    isMenedher: false,
    author: 'manager1',
    comentMeneger: ''
  },
  {
    id: 10,
    date: '06.19.2024 | 19:15',
    name: 'Гончаренко Дмитро Олександрович',
    email: 'goncharenko.dima@gmail.com',
    phone: '+38(093)123-45-67',
    pib: 'Гончаренко Дмитро Олександрович',
    deliveryType: 'Укрпошта',
    oblast: 'Житомирська область',
    city: 'Житомир',
    department: '5',
    coment: 'Термінова доставка, максимально швидко',
    sum: '3670',
    status: 'Завершен',
    isMenedher: true,
    author: 'admin',
    comentMeneger: 'Додано термінову доставку +150 грн.'
  },
  {
    id: 11,
    date: '04.30.2024 | 08:45',
    name: 'Кравчук Анастасія Сергіївна',
    email: 'kravchuk.nastya@ukr.net',
    phone: '+38(066)987-65-43',
    pib: 'Кравчук Анастасія Сергіївна',
    deliveryType: 'Нова Пошта',
    oblast: 'Рівненська область',
    city: 'Рівне',
    department: '28',
    coment: 'Кольори: бежевий, розмір S',
    sum: '1430',
    status: 'Оплата',
    isMenedher: false,
    author: 'manager2',
    comentMeneger: ''
  },
  {
    id: 12,
    date: '08.11.2024 | 17:20',
    name: 'Ткаченко Віталій Петрович',
    email: 'tkachenko.vitaliy@gmail.com',
    phone: '+38(050)345-67-89',
    pib: 'Ткаченко Віталій Петрович',
    deliveryType: 'Самовивіз',
    oblast: 'Херсонська область',
    city: 'Херсон',
    department: '',
    coment: 'Зателефонувати за годину до приїзду',
    sum: '980',
    status: 'Завершен',
    isMenedher: true,
    author: 'admin',
    comentMeneger: 'Клієнт забрав, все добре'
  },
  {
    id: 13,
    date: '09.05.2024 | 21:10',
    name: 'Савченко Марія Олегівна',
    email: 'savchenko.maria@yahoo.com',
    phone: '+38(063)876-54-32',
    pib: 'Савченко Марія Олегівна',
    deliveryType: 'Нова Пошта',
    oblast: 'Чернігівська область',
    city: 'Чернігів',
    department: '14',
    coment: 'Потрібна додаткова інформація про товар',
    sum: '2560',
    status: 'Все оформленные',
    isMenedher: false,
    author: 'manager1',
    comentMeneger: ''
  },
  {
    id: 14,
    date: '07.24.2024 | 14:55',
    name: 'Романенко Олег Васильович',
    email: 'romanenko.oleg@gmail.com',
    phone: '+38(096)234-56-78',
    pib: 'Романенко Олег Васильович',
    deliveryType: 'Укрпошта',
    oblast: 'Сумська область',
    city: 'Суми',
    department: '7',
    coment: 'Замовлення для офісу, потрібен звіт',
    sum: '4320',
    status: 'Завершен',
    isMenedher: true,
    author: 'admin',
    comentMeneger: 'Звіт буде готовий до 20.07'
  },
  {
    id: 15,
    date: '05.15.2024 | 12:30',
    name: 'Кузьменко Ірина Анатоліївна',
    email: 'kuzmenko.irina@ukr.net',
    phone: '+38(067)765-43-21',
    pib: 'Кузьменко Ірина Анатоліївна',
    deliveryType: 'Нова Пошта',
    oblast: 'Тернопільська область',
    city: 'Тернопіль',
    department: '19',
    coment: 'Потрібно обміняти розмір з M на L',
    sum: '1780',
    status: 'Оплата',
    isMenedher: false,
    author: 'manager2',
    comentMeneger: ''
  }
]
import AdminHeader from '@/app/components/Admin/AdminHeader/AdminHeader'
import type { Locale } from '@/i18n.config'
import { useState, useEffect, useCallback, useMemo } from 'react'
import './Orders.scss'
import LeftSVG from '@/app/assest/Admin/Left.svg'
import RightSVG from '@/app/assest/Admin/Right.svg'
import SearchSVG from '@/app/assest/Admin/Search.svg'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Order {
  id: number
  date: string
  name: string
  email: string
  phone: string
  pib: string
  deliveryType: string
  oblast: string
  city: string
  department: string
  coment: string
  sum: string
  status: string
  isMenedher: boolean
  author: string
  comentMeneger: string
}

interface SortConfig {
  key: keyof Order
  direction: 'ascending' | 'descending'
}

const ITEMS_PER_PAGE = 15

// Компонент карточки заказа для мобильного представления
const OrderCard = ({
  order,
  isSelected,
  onToggleSelect,
  expandedOrderId,
  setExpandedOrderId,
  handleCommentChange
}: {
  order: Order
  isSelected: boolean
  onToggleSelect: (id: number) => void
  expandedOrderId: number | null
  setExpandedOrderId: (id: number | null) => void
  handleCommentChange: (id: number, comment: string) => void
}) => {
  const isExpanded = expandedOrderId === order.id
  const router = useRouter()

  return (
    <div className={`order-card ${isSelected ? 'selected' : ''}`}>
      <div className='order-card-header'>
        <div className='order-checkbox'>
          <input
            type='checkbox'
            checked={isSelected}
            onChange={() => onToggleSelect(order.id)}
          />
        </div>
        <div className='order-id'>
          <span className='label'>ID:</span> {order.id}
        </div>
        <div className='order-status'>
          <span className='status-badge'>{order.status}</span>
        </div>
        <button
          className='expand-button'
          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
          aria-label={
            isExpanded ? 'Свернуть детали заказа' : 'Развернуть детали заказа'
          }
        >
          {isExpanded ? 'Закрыть' : 'Открыть'}
        </button>
      </div>

      <div className='order-card-summary'>
        <div className='order-name'>
          <span className='label'>Имя:</span> {order.name}
        </div>
        <div className='order-date'>
          <span className='label'>Дата:</span> {order.date}
        </div>
        <div className='order-sum'>
          <span className='label'>Сумма:</span> {order.sum} грн.
        </div>
      </div>

      {isExpanded && (
        <div className='order-card-details'>
          <div className='details-section'>
            <h4>Контактная информация</h4>
            <div className='info-row'>
              <span className='label'>E-mail:</span> {order.email}
            </div>
            <div className='info-row'>
              <span className='label'>Телефон:</span> {order.phone}
            </div>
            <div className='info-row'>
              <span className='label'>Ф.И.О.:</span> {order.pib}
            </div>
          </div>

          <div className='details-section'>
            <h4>Доставка</h4>
            <div className='info-row'>
              <span className='label'>Тип доставки:</span> {order.deliveryType}
            </div>
            <div className='info-row'>
              <span className='label'>Область:</span> {order.oblast}
            </div>
            <div className='info-row'>
              <span className='label'>Город:</span> {order.city}
            </div>
            {order.department && (
              <div className='info-row'>
                <span className='label'>Отделение:</span> {order.department}
              </div>
            )}
          </div>

          <div className='details-section'>
            <h4>Позиции заказа</h4>
            <div className='order-items'>
              <div className='order-item'>
                <div className='item-title'>
                  Полуперманентные красители прямого действия Elgon I-Light 100
                  ml (100 ml) (28926)
                </div>
                <div className='item-details'>
                  <div className='item-price'>
                    <span className='label'>Цена:</span> 250 грн.
                  </div>
                  <div className='item-quantity'>
                    <span className='label'>Количество:</span> 4 шт.
                  </div>
                  <div className='item-total'>
                    <span className='label'>Сумма:</span> 1000 грн.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='details-section'>
            <h4>Комментарий клиента</h4>
            <div className='info-row'>{order.coment}</div>
          </div>

          <div className='details-section'>
            <h4>Информация менеджера</h4>
            <div className='info-row'>
              <span className='label'>Комментарий менеджера:</span>
              <textarea
                className='manager-comment'
                defaultValue={order.comentMeneger}
                onChange={e => handleCommentChange(order.id, e.target.value)}
                placeholder='Введите комментарий'
              ></textarea>
            </div>
            <div className='info-row'>
              <span className='label'>Бонус менеджера:</span>{' '}
              {order.comentMeneger}
            </div>
            <div className='info-row'>
              <span className='label'>Всего заработано:</span>{' '}
              {order.comentMeneger}
            </div>
            <div className='action-buttons'>
              <button
                className='edit-button'
                onClick={() =>
                  router.push(`/ru/admin/orders/edit-order/${order.id}`)
                }
              >
                Редактировать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const OrdersPageManager = ({
  params: { lang }
}: {
  params: { lang: Locale }
}) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders)
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('1')
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(initialOrders.length / ITEMS_PER_PAGE)
  )
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [expandedFilters, setExpandedFilters] = useState<boolean>(false)
  const [expandedBulkOperations, setExpandedBulkOperations] =
    useState<boolean>(false)
  const [bulkAction, setBulkAction] = useState<string>('1')

  // Проверяем, находимся ли мы на мобильном устройстве
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1440)
    }

    // Начальная проверка
    checkIfMobile()

    // Добавляем слушатель события изменения размера окна
    window.addEventListener('resize', checkIfMobile)

    // Очистка
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Функция для обновления комментария менеджера
  const handleCommentChange = useCallback(
    (orderId: number, comment: string) => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, comentMeneger: comment } : order
        )
      )
    },
    []
  )

  // Функция для сортировки заказов
  const sortOrders = useCallback(
    (key: keyof Order) => {
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
    [filteredOrders, sortConfig]
  )

  // Функция для выбора/отмены выбора всех заказов
  const toggleSelectAll = useCallback(
    (isSelected: boolean) => {
      if (isSelected) {
        const currentPageIds = getCurrentPageOrders().map(order => order.id)
        setSelectedOrderIds(currentPageIds)
      } else {
        setSelectedOrderIds([])
      }
    },
    [currentPage, filteredOrders]
  )

  // Функция для выбора/отмены выбора одного заказа
  const toggleSelectOrder = useCallback((orderId: number) => {
    setSelectedOrderIds(prevSelected => {
      if (prevSelected.includes(orderId)) {
        return prevSelected.filter(id => id !== orderId)
      } else {
        return [...prevSelected, orderId]
      }
    })
  }, [])

  // Фильтрация заказов по поисковому запросу, датам и статусу
  useEffect(() => {
    let result = [...initialOrders]
    if (searchTerm) {
      result = result.filter(order =>
        Object.values(order).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
    if (startDate) {
      const startDateTime = new Date(startDate).getTime()
      result = result.filter(order => {
        const orderDate = new Date(order.date.split(' | ')[0]).getTime()
        return orderDate >= startDateTime
      })
    }
    if (endDate) {
      const endDateTime = new Date(endDate).getTime()
      result = result.filter(order => {
        const orderDate = new Date(order.date.split(' | ')[0]).getTime()
        return orderDate <= endDateTime
      })
    }
    if (statusFilter !== '1') {
      const statusMap: Record<string, string> = {
        '2': 'В ожидании',
        '3': 'Проверка',
        '4': 'Оплата',
        '5': 'Наложка',
        '6': 'Завершен',
        '7': 'Отменен',
        '8': 'Корзина'
      }
      result = result.filter(order => order.status === statusMap[statusFilter])
    }
    setFilteredOrders(result)
    setCurrentPage(1)
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE))
  }, [searchTerm, startDate, endDate, statusFilter])

  // Функция для получения заказов на текущей странице
  const getCurrentPageOrders = useCallback(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredOrders.slice(startIndex, endIndex)
  }, [currentPage, filteredOrders])

  // Функция для изменения страницы
  const changePage = useCallback(
    (page: number) => {
      if (page > 0 && page <= totalPages) {
        setCurrentPage(page)
        // Сбрасываем выбранные заказы при переходе на другую страницу
        setSelectedOrderIds([])
        // Закрываем развернутый заказ при смене страницы
        setExpandedOrderId(null)
      }
    },
    [totalPages]
  )

  // Проверка, выбраны ли все заказы на текущей странице
  const areAllCurrentPageOrdersSelected = useMemo(() => {
    const currentPageIds = getCurrentPageOrders().map(order => order.id)
    return (
      currentPageIds.length > 0 &&
      currentPageIds.every(id => selectedOrderIds.includes(id))
    )
  }, [getCurrentPageOrders, selectedOrderIds])

  // Применение массовых операций к выбранным заказам
  const applyBulkAction = useCallback(() => {
    if (bulkAction === '1' || selectedOrderIds.length === 0) return

    // Здесь будет логика для выполнения массовых операций
    alert(`Применение операции к заказам с ID: ${selectedOrderIds.join(', ')}`)
  }, [selectedOrderIds, bulkAction])

  // Генерация номеров страниц для пагинации
  const generatePageNumbers = useCallback(() => {
    const pageNumbers = []
    const maxVisiblePages = 6

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Более умная логика для отображения номеров страниц при большом количестве страниц
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }, [currentPage, totalPages])

  // Переключение видимости фильтров на мобильных устройствах
  const toggleFilters = useCallback(() => {
    setExpandedFilters(prev => !prev)
  }, [])

  // Переключение видимости массовых операций
  const toggleBulkOperations = useCallback(() => {
    setExpandedBulkOperations(prev => !prev)
  }, [])

  const router = useRouter()

  return (
    <div className='orders-container'>
      <AdminHeader url='orders' name='Заказы' lang={lang} />

      {/* Секция массовых операций - теперь вверху */}

      <div className='orders-header-container'>
        <div className='order-header'>
          <h3>Всего заказов: {filteredOrders.length}</h3>

          {isMobile && (
            <button className='toggle-filters-btn' onClick={toggleFilters}>
              {expandedFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
            </button>
          )}

          <div
            className={`filters ${isMobile && !expandedFilters ? 'filters-hidden' : ''}`}
          >
            <div className='filter-row'>
              <div className='start'>
                <span className='filter-label'>Дата начала:</span>
                <input
                  type='date'
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div className='finish'>
                <span className='filter-label'>Дата окончания:</span>
                <input
                  type='date'
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className='filter-row'>
              <div className='status'>
                <span className='filter-label status__label'>
                  Статус заказа:
                </span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value='1'>Все оформленные</option>
                  <option value='2'>В ожидании</option>
                  <option value='3'>Проверка</option>
                  <option value='4'>Оплата</option>
                  <option value='5'>Наложка</option>
                  <option value='6'>Завершен</option>
                  <option value='7'>Отменен</option>
                  <option value='8'>Корзина</option>
                </select>
              </div>
              <div className='add' style={{ position: 'relative' }}>
                <Link
                  href={`orders/new-order`}
                  style={{ position: 'absolute', inset: 0 }}
                ></Link>
                Добавить заказ
              </div>
            </div>

            <div className='search'>
              <input
                type='text'
                placeholder='Поиск по названию/артикулу товара, номеру телефона, E-mail'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className='search-svg'>
                <SearchSVG />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isMobile && (
        <div className='selects-adn-input'>
          <select>
            <option value='1'>Массовые операции</option>
            <option value='2'> Удалить заказ</option>
            <option value='3'>Установить статус заказа: Отменен</option>
            <option value='4'>Установить статус заказа: Корзина</option>
            <option value='5'>
              Установить статус заказа: Оформить заказ (оформить заказ)
            </option>
            <option value='6'>
              Установить статус заказа: Оформить заказ (завершено)
            </option>
            <option value='7'>
              Установить статус заказа: Оформить заказ (оплата)
            </option>
            <option value='8'>
              Установить статус заказа: Оформить заказ (доставка)
            </option>
            <option value='9'>Установить статус заказа: Выполнен</option>
            <option value='10'>
              Установить статус заказа: В ожидании (в ожидании)
            </option>
            <option value='11'>
              Установить статус заказа: В ожидании (обработка)
            </option>
          </select>

          <button
            onClick={applyBulkAction}
            disabled={selectedOrderIds.length === 0}
          >
            Применить
          </button>
        </div>
      )}

      {isMobile ? (
        <div className='mobile-orders-list'>
          {getCurrentPageOrders().map(order => (
            <OrderCard
              key={order.id}
              order={order}
              isSelected={selectedOrderIds.includes(order.id)}
              onToggleSelect={toggleSelectOrder}
              expandedOrderId={expandedOrderId}
              setExpandedOrderId={setExpandedOrderId}
              handleCommentChange={handleCommentChange}
            />
          ))}

          {getCurrentPageOrders().length === 0 && (
            <div className='no-orders'>Нет заказов для отображения</div>
          )}
        </div>
      ) : (
        <div className='list-reviews'>
          <div className='review review-header'>
            <input
              type='checkbox'
              checked={areAllCurrentPageOrdersSelected}
              onChange={e => toggleSelectAll(e.target.checked)}
            />
            <div className='id' onClick={() => sortOrders('id')}>
              ID{' '}
              {sortConfig?.key === 'id' &&
                (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </div>
            <div className='date' onClick={() => sortOrders('date')}>
              Дата{' '}
              {sortConfig?.key === 'date' &&
                (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </div>
            <div className='name' onClick={() => sortOrders('name')}>
              Имя{' '}
              {sortConfig?.key === 'name' &&
                (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </div>
            <div className='email' onClick={() => sortOrders('email')}>
              E-mail{' '}
              {sortConfig?.key === 'email' &&
                (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </div>
            <div className='contact-info'>Контактная информация</div>
            <div className='order-list-basket'>Позиции заказа</div>
            <div
              className='coment-meneger'
              onClick={() => sortOrders('status')}
            >
              Статус{' '}
              {sortConfig?.key === 'status' &&
                (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </div>
            <div className='status' style={{ textAlign: 'center' }}>
              Комментарий менеджера
            </div>
            <div className='coment-meneger'>Бонус менеджера</div>
            <div className='coment-meneger'>Всего заработано</div>
            <div className='coment-meneger' style={{ textAlign: 'center' }}>
              Действия
            </div>
          </div>
          {getCurrentPageOrders().map((order, index) => (
            <div
              className={`review ${selectedOrderIds.includes(order.id) ? 'selected' : ''}`}
              style={{
                backgroundColor: index % 2 == 0 ? '#2695691A' : '#A5A1A100'
              }}
              key={order.id}
            >
              <input
                type='checkbox'
                checked={selectedOrderIds.includes(order.id)}
                onChange={() => toggleSelectOrder(order.id)}
              />
              <div className='id'>{order.id}</div>
              <div className='date'>{order.date}</div>
              <div className='name'>{order.name}</div>
              <div className='email'>{order.email}</div>
              <div className='contact-info'>
                <div className='info'>
                  <p>Телефон:</p>
                  <span>{order.phone}</span>
                </div>
                <div className='info'>
                  <p>Ф.И.О.:</p>
                  <span>{order.pib}</span>
                </div>
                <div className='info'>
                  <p>Вариант доставки:</p>
                  <span>{order.deliveryType}</span>
                </div>
                <div className='info'>
                  <p>Область:</p>
                  <span>{order.oblast}</span>
                </div>
                <div className='info'>
                  <p>Населенный пункт:</p>
                  <span>{order.city}</span>
                </div>
                <div className='info'>
                  <p>Комментарий:</p>
                  <span>{order.coment}</span>
                </div>
              </div>
              <div className='order-list-basket'>
                <div className='order-list-basket-header'>
                  <div className='title'>Заголовок</div>
                  <div className='price-with-one'>Цена за шт.</div>
                  <div className='count'>Кол-во</div>
                  <div className='sum'>Сумма</div>
                </div>
                <div className='list-basket'>
                  <div className='title'>
                    Полуперманентные красители прямого действия Elgon I-Light
                    100 ml (100 ml) (28926)
                  </div>

                  <div className='price-with-one'>250 грн.</div>
                  <div className='count'>4 шт.</div>
                  <div className='sum'>1000 грн.</div>
                </div>
              </div>
              <div className='coment-meneger'>{order.status}</div>
              <textarea
                className='status'
                style={{ textAlign: 'center' }}
                defaultValue={order.comentMeneger}
                onChange={e => handleCommentChange(order.id, e.target.value)}
              ></textarea>
              <div className='coment-meneger'>{order.comentMeneger}</div>
              <div className='coment-meneger'>{order.comentMeneger}</div>
              <div className='coment-meneger'>
                {' '}
                <button
                  className='edit-button'
                  onClick={() =>
                    router.push(`/ru/admin/orders/edit-order/${order.id}`)
                  }
                >
                  Редактировать
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isMobile && (
        <div className='selects-adn-input'>
          <select>
            <option value='1'>Массовые операции</option>
            <option value='2'> Удалить заказ</option>
            <option value='3'>Установить статус заказа: Отменен</option>
            <option value='4'>Установить статус заказа: Корзина</option>
            <option value='5'>
              Установить статус заказа: Оформить заказ (оформить заказ)
            </option>
            <option value='6'>
              Установить статус заказа: Оформить заказ (завершено)
            </option>
            <option value='7'>
              Установить статус заказа: Оформить заказ (оплата)
            </option>
            <option value='8'>
              Установить статус заказа: Оформить заказ (доставка)
            </option>
            <option value='9'>Установить статус заказа: Выполнен</option>
            <option value='10'>
              Установить статус заказа: В ожидании (в ожидании)
            </option>
            <option value='11'>
              Установить статус заказа: В ожидании (обработка)
            </option>
          </select>

          <button
            onClick={applyBulkAction}
            disabled={selectedOrderIds.length === 0}
          >
            Применить
          </button>
        </div>
      )}
      {totalPages <= 1 ? null : (
        <div className='pagination'>
          <div
            className={`left ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => changePage(currentPage - 1)}
          >
            <LeftSVG />
          </div>
          {generatePageNumbers().map(pageNum => (
            <div
              key={pageNum}
              className={`number ${pageNum === currentPage ? 'select' : ''}`}
              onClick={() => changePage(pageNum)}
            >
              {pageNum}
            </div>
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
  )
}

export default OrdersPageManager
