'use client';
import React, { use } from 'react';
import './User.scss';
import AdminHeader from '@/app/components/Admin/AdminHeader/AdminHeader';
import { Locale } from '@/i18n.config';
import dynamic from 'next/dynamic';
const UserSortableTable = dynamic(() => import('./PageUsersSorted'));

/*
const users = [
  {
    id: 1,
    name: 'Олександр',
    email: 'alexander234@gmail.com',
    stayActive: '05.12.2024 | 14:30',
    dateRegister: '15.01.2025',
    countOrders: 7,
    sumOrders: 12450
  },
  {
    id: 2,
    name: 'Анна',
    email: 'anna.kovalchuk@ukr.net',
    stayActive: '06.03.2024 | 09:45',
    dateRegister: '22.02.2025',
    countOrders: 3,
    sumOrders: 6780
  },
  {
    id: 3,
    name: 'Віктор',
    email: 'viktor.petrenko@gmail.com',
    stayActive: '07.18.2024 | 18:20',
    dateRegister: '03.03.2025',
    countOrders: 12,
    sumOrders: 25600
  },
  {
    id: 4,
    name: 'Ірина',
    email: 'irina_shevchenko@yahoo.com',
    stayActive: '04.05.2024 | 22:10',
    dateRegister: '10.01.2025',
    countOrders: 5,
    sumOrders: 9870
  },
  {
    id: 5,
    name: 'Максим',
    email: 'maxym1990@gmail.com',
    stayActive: '08.22.2024 | 11:15',
    dateRegister: '28.02.2025',
    countOrders: 9,
    sumOrders: 15320
  },
  {
    id: 6,
    name: 'Наталія',
    email: 'natali.bilenko@ukr.net',
    stayActive: '09.30.2024 | 16:40',
    dateRegister: '05.03.2025',
    countOrders: 2,
    sumOrders: 4320
  },
  {
    id: 7,
    name: 'Сергій',
    email: 'sergiy_ivanov@gmail.com',
    stayActive: '03.14.2024 | 20:25',
    dateRegister: '18.01.2025',
    countOrders: 6,
    sumOrders: 11200
  },
  {
    id: 8,
    name: 'Юлія',
    email: 'yulia.tkachenko@yahoo.com',
    stayActive: '07.05.2024 | 13:50',
    dateRegister: '22.03.2025',
    countOrders: 8,
    sumOrders: 18760
  },
  {
    id: 9,
    name: 'Андрій',
    email: 'andriy.melnyk@gmail.com',
    stayActive: '05.28.2024 | 10:30',
    dateRegister: '14.02.2025',
    countOrders: 4,
    sumOrders: 7650
  },
  {
    id: 10,
    name: 'Тетяна',
    email: 'tanya.bondar@ukr.net',
    stayActive: '06.19.2024 | 19:15',
    dateRegister: '08.03.2025',
    countOrders: 11,
    sumOrders: 23450
  },
  {
    id: 11,
    name: 'Павло',
    email: 'pavlo.sydorenko@gmail.com',
    stayActive: '04.30.2024 | 08:45',
    dateRegister: '25.01.2025',
    countOrders: 1,
    sumOrders: 2100
  },
  {
    id: 12,
    name: 'Оксана',
    email: 'oksana.lisova@yahoo.com',
    stayActive: '08.11.2024 | 17:20',
    dateRegister: '30.03.2025',
    countOrders: 7,
    sumOrders: 14320
  },
  {
    id: 13,
    name: 'Дмитро',
    email: 'dmitro.kravchenko@gmail.com',
    stayActive: '09.05.2024 | 21:10',
    dateRegister: '12.02.2025',
    countOrders: 3,
    sumOrders: 5980
  },
  {
    id: 14,
    name: 'Марина',
    email: 'marina.popova@ukr.net',
    stayActive: '07.24.2024 | 14:55',
    dateRegister: '19.03.2025',
    countOrders: 10,
    sumOrders: 21500
  },
  {
    id: 15,
    name: 'Володимир',
    email: 'volodymyr.zelenko@gmail.com',
    stayActive: '05.15.2024 | 12:30',
    dateRegister: '05.01.2025',
    countOrders: 5,
    sumOrders: 8760
  },
  {
    id: 16,
    name: 'Світлана',
    email: 'svitlana.romanenko@yahoo.com',
    stayActive: '06.28.2024 | 23:40',
    dateRegister: '27.02.2025',
    countOrders: 2,
    sumOrders: 4100
  },
  {
    id: 17,
    name: 'Артем',
    email: 'artem.savchenko@gmail.com',
    stayActive: '08.03.2024 | 16:15',
    dateRegister: '15.03.2025',
    countOrders: 6,
    sumOrders: 10980
  },
  {
    id: 18,
    name: 'Аліна',
    email: 'alina.koval@ukr.net',
    stayActive: '04.22.2024 | 19:50',
    dateRegister: '10.02.2025',
    countOrders: 8,
    sumOrders: 17650
  },
  {
    id: 19,
    name: 'Ігор',
    email: 'ihor.petrov@gmail.com',
    stayActive: '09.12.2024 | 10:25',
    dateRegister: '25.03.2025',
    countOrders: 4,
    sumOrders: 7200
  },
  {
    id: 20,
    name: 'Катерина',
    email: 'kateryna.sydorova@yahoo.com',
    stayActive: '07.08.2024 | 13:20',
    dateRegister: '08.01.2025',
    countOrders: 9,
    sumOrders: 19870
  },
  {
    id: 21,
    name: 'Роман',
    email: 'roman.babiy@gmail.com',
    stayActive: '05.20.2024 | 22:15',
    dateRegister: '20.02.2025',
    countOrders: 1,
    sumOrders: 1850
  },
  {
    id: 22,
    name: 'Надія',
    email: 'nadiya.vasylenko@ukr.net',
    stayActive: '06.14.2024 | 11:40',
    dateRegister: '12.03.2025',
    countOrders: 5,
    sumOrders: 9430
  },
  {
    id: 23,
    name: 'Василь',
    email: 'vasyl.moroz@gmail.com',
    stayActive: '08.29.2024 | 18:30',
    dateRegister: '28.01.2025',
    countOrders: 7,
    sumOrders: 13200
  },
  {
    id: 24,
    name: 'Ольга',
    email: 'olha.boiko@yahoo.com',
    stayActive: '04.10.2024 | 09:55',
    dateRegister: '17.03.2025',
    countOrders: 3,
    sumOrders: 5670
  },
  {
    id: 25,
    name: 'Михайло',
    email: 'mykhailo.lysenko@gmail.com',
    stayActive: '09.22.2024 | 20:45',
    dateRegister: '05.02.2025',
    countOrders: 10,
    sumOrders: 22450
  },
  {
    id: 26,
    name: 'Лариса',
    email: 'larisa.pavlova@ukr.net',
    stayActive: '07.17.2024 | 14:10',
    dateRegister: '22.01.2025',
    countOrders: 2,
    sumOrders: 3980
  },
  {
    id: 27,
    name: 'Богдан',
    email: 'bohdan.savchuk@gmail.com',
    stayActive: '05.07.2024 | 17:25',
    dateRegister: '15.03.2025',
    countOrders: 6,
    sumOrders: 11560
  },
  {
    id: 28,
    name: 'Яна',
    email: 'yana.kovalenko@yahoo.com',
    stayActive: '06.30.2024 | 23:15',
    dateRegister: '10.02.2025',
    countOrders: 8,
    sumOrders: 16780
  },
  {
    id: 29,
    name: 'Євген',
    email: 'yevhen.sydorenko@gmail.com',
    stayActive: '08.18.2024 | 12:40',
    dateRegister: '25.02.2025',
    countOrders: 4,
    sumOrders: 7850
  },
  {
    id: 30,
    name: 'Ганна',
    email: 'hanna.melnychuk@ukr.net',
    stayActive: '04.25.2024 | 21:20',
    dateRegister: '18.03.2025',
    countOrders: 9,
    sumOrders: 20340
  },
  {
    id: 31,
    name: 'Віталій',
    email: 'vitaliy.kuzmin@gmail.com',
    stayActive: '09.08.2024 | 15:55',
    dateRegister: '08.01.2025',
    countOrders: 1,
    sumOrders: 2300
  },
  {
    id: 32,
    name: 'Софія',
    email: 'sofia.zakharenko@yahoo.com',
    stayActive: '07.03.2024 | 10:30',
    dateRegister: '20.03.2025',
    countOrders: 5,
    sumOrders: 9120
  },
  {
    id: 33,
    name: 'Станіслав',
    email: 'stanislav.romanov@gmail.com',
    stayActive: '05.25.2024 | 19:45',
    dateRegister: '12.02.2025',
    countOrders: 7,
    sumOrders: 12670
  },
  {
    id: 34,
    name: 'Валерія',
    email: 'valeriya.semenova@ukr.net',
    stayActive: '06.08.2024 | 22:10',
    dateRegister: '28.01.2025',
    countOrders: 3,
    sumOrders: 6540
  },
  {
    id: 35,
    name: 'Олег',
    email: 'oleg.vasyliev@gmail.com',
    stayActive: '08.14.2024 | 13:25',
    dateRegister: '15.02.2025',
    countOrders: 10,
    sumOrders: 21890
  },
  {
    id: 36,
    name: 'Ангеліна',
    email: 'angelina.kravets@yahoo.com',
    stayActive: '04.19.2024 | 16:50',
    dateRegister: '05.03.2025',
    countOrders: 2,
    sumOrders: 3760
  },
  {
    id: 37,
    name: 'Тарас',
    email: 'taras.shevchuk@gmail.com',
    stayActive: '09.28.2024 | 11:35',
    dateRegister: '22.02.2025',
    countOrders: 6,
    sumOrders: 10890
  },
  {
    id: 38,
    name: 'Зоя',
    email: 'zoya.ivanova@ukr.net',
    stayActive: '07.11.2024 | 20:20',
    dateRegister: '10.01.2025',
    countOrders: 8,
    sumOrders: 15430
  },
  {
    id: 39,
    name: 'Мирослав',
    email: 'myroslav.petrenko@gmail.com',
    stayActive: '05.03.2024 | 14:15',
    dateRegister: '25.03.2025',
    countOrders: 4,
    sumOrders: 6980
  },
  {
    id: 40,
    name: 'Дарина',
    email: 'darina.morozova@yahoo.com',
    stayActive: '06.25.2024 | 18:40',
    dateRegister: '12.01.2025',
    countOrders: 11,
    sumOrders: 24780
  }
]*/

const page = ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = use(params);
  return (
    <>
      <AdminHeader url="reviews" name="Пользователи" lang={lang} />
      <div className="admin-user-container">
        <UserSortableTable />
      </div>
    </>
  );
};

export default page;
