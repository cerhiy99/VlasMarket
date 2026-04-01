'use client';
import Link from 'next/link';
import OrdersSVG from '@/public/svgs/userNavigation/orders.svg';
import FavoritiesSVG from '@/public/svgs/userNavigation/favorite.svg';
import CartSVG from '@/public/svgs/userNavigation/cart.svg';
import ImageSvg from '@/public/svgs/userNavigation/img.svg';
import HomeSvg from '@/public/svgs/userNavigation/home.svg';
import DataSvg from '@/public/svgs/userNavigation/personalData.svg';
import WatchedSvg from '@/public/svgs/userNavigation/wathced.svg';
import ExitSVG from '@/app/assest/Admin/Exit.svg';
import { Locale } from '@/i18n.config';
import Discounts from '@/public/svgs/posters/discount.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { logout } from '@/app/store/reducers/userReducers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { $authHost } from '@/app/http';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';

const UserDashboard = ({ lang }: { lang: Locale }) => {
  const discpatch = useDispatch();
  const router = useRouter();
  const { user, BasketAndLike } = useSelector((state: RootState) => state);
  const { t } = useTranslation();
  const userData = {
    name: user.user?.name + ' ' + user.user?.surname,
    favorites: BasketAndLike.like.length,
    cart: BasketAndLike.basket.length,
  };
  const [discount, setDiscount] = useState<number>(0);
  const [orders, setOrders] = useState<number>(0);
  const getData = async () => {
    try {
      const res = await $authHost.get('user/getDiscountAndOrders');
      setDiscount(res.data.procent);
      setOrders(res.data.orderCount);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const handlerLogOut = () => {
    discpatch(logout());
    router.push(getLocalizedPath(`/${lang}`, lang));
  };
  return (
    <>
      <div className="cabinetLayout__header">
        <div className="styled__wrapper">
          <div className="header--avatar">
            <div className="avatarWrapper">
              <span style={{ whiteSpace: 'nowrap' }}>
                {userData.name[0].toUpperCase()}
              </span>
            </div>
            <div className="userDetails">
              <div>
                <span style={{ whiteSpace: 'nowrap' }}>{userData.name}</span>
              </div>
              <div>
                <Link
                  style={{ whiteSpace: 'nowrap' }}
                  href={getLocalizedPath(
                    `/${lang}/user-cabinet/personal-info`,
                    lang
                  )}
                >
                  {t('userDashboard.editInfo')}
                </Link>
              </div>
            </div>
          </div>
          <div className="header--discount">
            <div className="userDiscount__title">
              <span>{t('userDashboard.personalDiscount')}</span>
            </div>
            <div className="userDiscount__total">{discount}%</div>
          </div>
          <div className="exit23">
            <button onClick={handlerLogOut}>
              {lang == 'ru' ? 'Вийти' : 'Выйти'}
            </button>
          </div>
        </div>
        <div className="header--stats">
          <div className="inline--stat">
            <OrdersSVG width={20} />
            <p>{t('userDashboard.myOrders')}</p>
            <div className="stat--num">{orders}</div>
          </div>
          <div className="inline--stat">
            <FavoritiesSVG width={20} />
            <p>{t('userDashboard.myFavorites')}</p>
            <div className="stat--num">{userData.favorites}</div>
          </div>
          <div className="inline--stat">
            <CartSVG />
            <p>{t('userDashboard.myCart')}</p>
            <div className="stat--num">{userData.cart}</div>
          </div>
        </div>
        <div className="header--title">
          <div className="user__hashtag">
            {t('userDashboard.taglinePart1')}
            <Link href={'#'}>#НАМБЕРВАН</Link> {t('userDashboard.taglinePart2')}
            <Link href={getLocalizedPath(`/${lang}/goods/1`, lang)}>
              {t('userDashboard.catalog')}
            </Link>
            {t('userDashboard.taglinePart3')}
            <Link href={getLocalizedPath(`/${lang}/goods/discount/1`, lang)}>
              {t('userDashboard.promotionalOffers')}
            </Link>
          </div>
        </div>
        <div className="header--image">
          <ImageSvg />
        </div>
      </div>
      <div className="cabinetLayout--navigation">
        <div className="inline--nav">
          <HomeSvg width={30} />
          <div className="nav__item">
            <div className="nav__text">
              <Link href={getLocalizedPath(`/${lang}/user-cabinet`, lang)}>
                {t('userDashboard.myCabinet')}
              </Link>
            </div>
          </div>
        </div>
        <div className="inline--nav">
          <DataSvg />
          <div className="nav__item">
            <div className="nav__text">
              <Link
                href={getLocalizedPath(
                  `/${lang}/user-cabinet/personal-info`,
                  lang
                )}
              >
                {t('userDashboard.personalData')}
              </Link>
            </div>
          </div>
        </div>
        <div className="inline--nav">
          <OrdersSVG width={27} />
          <div className="nav__item">
            <div className="nav__text">
              <Link
                href={getLocalizedPath(`/${lang}/user-cabinet/orders`, lang)}
              >
                {t('userDashboard.myOrders')}
              </Link>
            </div>
          </div>
        </div>
        <div className="inline--nav">
          <FavoritiesSVG width={28} />
          <div className="nav__item">
            <div className="nav__text">
              <Link
                href={getLocalizedPath(
                  `/${lang}/user-cabinet/selected-products`,
                  lang
                )}
              >
                {t('userDashboard.favoriteProducts')}
              </Link>
            </div>
          </div>
        </div>
        <div className="inline--nav">
          <Discounts width={32} height={32} />
          <div className="nav__item">
            <div className="nav__text">
              <Link
                href={getLocalizedPath(`/${lang}/user-cabinet/discount`, lang)}
              >
                {t('userDashboard.personalDiscountNav')}
              </Link>
            </div>
          </div>
        </div>
        <div className="inline--nav">
          <WatchedSvg width={28} />
          <div className="nav__item">
            <div className="nav__text">
              <Link
                href="#listGoodsLeft"
                scroll={false}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('listGoodsLeft')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
              >
                {t('userDashboard.viewedProducts')}
              </Link>
            </div>
          </div>
        </div>
        <div className="logout__user">
          <button className="logout__wrapper" onClick={handlerLogOut}>
            <ExitSVG color="black" />
            <span>{t('userDashboard.logout')}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
