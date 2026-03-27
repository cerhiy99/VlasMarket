'use client';

import type React from 'react';

import type { Locale } from '@/i18n.config';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import './Admin.scss';
import HomeSVG from '@/app/assest/Admin/Home.svg';
import ExitSVG from '@/app/assest/Admin/Exit.svg';
import { $authHost } from '@/app/http';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { logout, setToken } from '@/app/store/reducers/userReducers';
import { usePathname, useRouter } from 'next/navigation';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';

type TypeofRole = 'admin' | 'owner';

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = use(params);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthorize, user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isRole, setIsRole] = useState<TypeofRole>('owner');
  useEffect(() => {
    setIsRole(user?.adminAccess == 'owner' ? 'owner' : 'admin');
  }, [user]);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';
    const header = document.querySelector('header');
    if (header) header.style.display = 'none';
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      dispatch(setToken(localStorage.getItem('token') || ''));
    }
  }, []);
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (!isAuthorize) return;
        // Надішли запит на сервер: користувач активний
        const res = await $authHost.post('user/active', {
          method: 'POST',
          credentials: 'include', // якщо використовуєш куки
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ active: true }),
        });
        console.log(res);
      } catch (err) {
        if (err && typeof err === 'object' && 'status' in err && (err as any).status === 401) {
          dispatch(logout());
          router.push('/');
        }
      }
    }, 20000); // кожні 20 секунд
    return () => clearInterval(interval); // очистити інтервал при розмонтуванні
  }, [isAuthorize]);

  const pathname = usePathname();
  const [isTrue, setIsTrue] = useState(true);

  const avabileForAdmin = ['orders-for-manager', 'edit-order'];
  const avabileForMeneger = ['orders-for-manager', 'edit-order', 'new-order', 'orders'];

  useEffect(() => {
    if (!pathname) return;

    if (user?.email === 'meneger@gmail.com') {
      const ok = avabileForMeneger.some((item) => pathname.includes(item));
      setIsTrue(ok);
    } else if (user?.adminAccess === 'admin') {
      const ok = avabileForAdmin.some((item) => pathname.includes(item));
      setIsTrue(ok);
    }
  }, [pathname, user]);

  if (!isAuthorize || user?.adminAccess == 'user') {
    return <div>У вас недостатньо прав</div>;
  }
  return (
    <div id="admin-container" className="admin-container">
      <div className="header-admin-cont">
        <div className="header-admin">
          <div className="left">
            <Link href={`/${lang == 'ua' ? '' : 'ru'}`} className="header__link">
              <HomeSVG />
            </Link>
            <div className="header__Button" onClick={toggleMobileMenu}>
              <HomeSVG />
            </div>
            <div className="desktop-menu">
              {isRole === 'owner' && (
                <>
                  <div className="goods-dropdown-container">
                    <Link href={getLocalizedPath(`/${lang}/admin/`, lang)}>Товары</Link>
                    <div className="goods-dropdown">
                      <Link href={getLocalizedPath(`/${lang}/admin/brand`, lang)}>
                        Добавити бренд
                      </Link>
                      <Link href={getLocalizedPath(`/${lang}/admin/update-brend`, lang)}>
                        Оновити бренд
                      </Link>
                      <Link href={getLocalizedPath(`/${lang}/admin/country-made`, lang)}>
                        Добавити країну виробника
                      </Link>
                      <Link href={getLocalizedPath(`/${lang}/admin/category`, lang)}>
                        Добавити категорію
                      </Link>
                      <Link href={getLocalizedPath(`/${lang}/admin/category-filter`, lang)}>
                        Добавити фільтр для категорій
                      </Link>
                      <Link href={getLocalizedPath(`/${lang}/admin/subcategory`, lang)}>
                        Добавити підкатегорію
                      </Link>
                      <Link href={getLocalizedPath(`/${lang}/admin/recognitions`, lang)}>
                        Додати призначення
                      </Link>
                      <Link href={getLocalizedPath(`/${lang}/admin/line`, lang)}>Додати лінію</Link>
                      <div className="line" />
                      <Link href={getLocalizedPath(`/${lang}/admin/add-product`, lang)}>
                        Добавить товар
                      </Link>
                      <div className="line" />
                      <Link href={getLocalizedPath(`/${lang}/admin/goods`, lang)}>
                        Статистика товаров
                      </Link>
                      <Link href={getLocalizedPath(`/${lang}/admin/`, lang)}>Список товаров</Link>
                      <Link href={getLocalizedPath(`/${lang}/admin/goodsFilter`, lang)}>
                        Фільтр товарів
                      </Link>
                      <div className="line" />
                      <Link href={getLocalizedPath(`/${lang}/admin/instruktion`, lang)}>
                        Інструкція
                      </Link>
                    </div>
                  </div>
                  <div className="goods-dropdown-container">
                    <Link href={getLocalizedPath(`/${lang}/admin/blog/add`, lang)}>Блог</Link>
                    <div className="goods-dropdown">
                      <Link href={getLocalizedPath(`/${lang}/admin/blog/update/selectBlog`, lang)}>
                        Список блогу
                      </Link>
                      <Link href={getLocalizedPath(`/${lang}/admin/blog/add`, lang)}>
                        Добавити Блог
                      </Link>
                    </div>
                  </div>
                </>
              )}
              {user?.email == 'meneger@gmail.com' || user?.adminAccess == 'owner' ? (
                <Link href={getLocalizedPath(`/${lang}/admin/orders`, lang)}>Заказы</Link>
              ) : (
                <></>
              )}
              <Link href={`/${lang}/admin/orders-for-manager`}>Заказы для менеджера</Link>
              {isRole === 'owner' && (
                <>
                  <Link href={getLocalizedPath(`/${lang}/admin/reviews`, lang)}>Комментарии</Link>
                  <Link href={getLocalizedPath(`/${lang}/admin/users`, lang)}>Пользователи</Link>
                  <div className="goods-dropdown-container">
                    <Link href={getLocalizedPath(`/${lang}/admin/bane`, lang)}>Банеры</Link>
                  </div>{' '}
                </>
              )}
            </div>
          </div>

          <div className="right">
            <Link href={'#'} className="admin-greeting">
              Добрый день, {isRole === 'owner' ? 'Admin' : 'Manager'}
            </Link>
            <div className="right__wrapper">
              <Link href={getLocalizedPath(`/${lang}`, lang)}>Выход</Link>
              <ExitSVG color="white" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div onClick={() => setMobileMenuOpen(false)} className="mobile-menu-content">
          {isRole == 'owner' && (
            <>
              <Link href={getLocalizedPath(`/${lang}/admin/brand`, lang)}>Добавити бренд</Link>
              <Link href={getLocalizedPath(`/${lang}/admin/country-made`, lang)}>
                Добавити країну виробника
              </Link>
              <Link href={getLocalizedPath(`/${lang}/admin/category`, lang)}>
                Добавити категорію
              </Link>
              <Link href={getLocalizedPath(`/${lang}/admin/category-filter`, lang)}>
                Добавити фільтр для категорій
              </Link>
              <Link href={getLocalizedPath(`/${lang}/admin/subcategory`, lang)}>
                Добавити підкатегорію
              </Link>
              <Link href={getLocalizedPath(`/${lang}/admin/recognitions`, lang)}>
                Додати призначення
              </Link>
              <Link href={getLocalizedPath(`/${lang}/admin/line`, lang)}>Додати лінію</Link>
              <div className="line" />
              <Link href={getLocalizedPath(`/${lang}/admin/add-product`, lang)}>
                Добавить товар
              </Link>
              <div className="line" />
              <Link href={getLocalizedPath(`/${lang}/admin/goods`, lang)}>Статистика товаров</Link>
              <Link href={getLocalizedPath(`/${lang}/admin/`, lang)}>Список товаров</Link>
              <Link href={getLocalizedPath(`/${lang}/admin/goodsFilter`, lang)}>
                Фільтр товарів
              </Link>
              <div className="line" />
              <Link href={getLocalizedPath(`/${lang}/admin/instruktion`, lang)}>Інструкція</Link>
              <Link href={getLocalizedPath(`/${lang}/admin/blog/add`, lang)}>Блог</Link>
              <Link href={`/${lang}/admin/orders`}>Заказы</Link>
              <Link href={`/${lang}/admin/orders-for-manager`}>Заказы для менеджера</Link>
              <Link href={getLocalizedPath(`/${lang}/admin/reviews`, lang)}>Комментарии</Link>
              <Link href={getLocalizedPath(`/${lang}/admin/users`, lang)}>Пользователи</Link>
              <Link href={getLocalizedPath(`/${lang}/admin/bane`, lang)}>Банеры</Link>
            </>
          )}
          {isRole == 'admin' && (
            <>
              {user?.email == 'meneger@gmail.com' && (
                <Link href={getLocalizedPath(`/${lang}/admin/orders`, lang)}>Заказы</Link>
              )}
              <Link href={getLocalizedPath(`/${lang}/admin/orders-for-manager`, lang)}>
                Заказы для менеджера
              </Link>
            </>
          )}

          <div className="mobile-menu-footer">
            <Link
              href={getLocalizedPath(`/${lang}`, lang)}
              className="mobile-menu-item exit-link"
              onClick={toggleMobileMenu}
            >
              Выход <ExitSVG color="white" />
            </Link>
          </div>
        </div>
      </div>

      <div className="children">
        {user?.adminAccess == 'admin' && !isTrue ? <div>У вас недостатньо прав</div> : children}
      </div>
    </div>
  );
}
