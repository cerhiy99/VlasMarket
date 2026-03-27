'use client';

import { Locale } from '@/i18n.config';
import './selectedPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import Image from 'next/image';
import BasketSVG from '@/public/svgs/userNavigation/Del.svg';
import Link from 'next/link';
import { removeFromLike } from '@/app/store/reducers/cartReducer';
import TabNavigation from '../components/tabNavigation';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';
import { use } from 'react';

const SelectedProductsPage = ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = use(params);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { like: basket } = useSelector((state: RootState) => state.BasketAndLike);

  const delWithBasket = (id: number) => {
    dispatch(removeFromLike(id));
  };

  return (
    <div className="selectedProducts">
      <div className="selectedProducts__title">{t('selectedProductsPage.title')}</div>
      <div className="selectedProducts__container">
        {basket.length === 0 ? (
          <div className="selectedProducts__item">
            <div className="selectedProducts__noneWrapper">
              <div className="selectedProducts__none">{t('selectedProductsPage.emptyMessage')}</div>
              <div className="selectedProducts__none--link">
                {t('selectedProductsPage.emptyLinkPrefix')}{' '}
                <Link href={getLocalizedPath(`/${lang}/goods/1`, lang)}>
                  {t('selectedProductsPage.emptyLinkText')}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          basket.map((product) => (
            <div className="selectedProducts__item" key={product.id}>
              <div className="item-image">
                <Image
                  src={process.env.NEXT_PUBLIC_SERVER + product.volume.img}
                  width={91}
                  height={129}
                  alt={'selected product'}
                />
              </div>
              <div className="itemInfo">
                <div className="itemInfo__description">
                  {lang === 'ru' ? product.nameRU : product.nameUA}
                </div>
                {/* <div className='itemInfo__rating'>
                 <div className='rating'>
                    <Rating
                      name='half-rating-read'
                      defaultValue={4.5}
                      precision={0.1}
                      readOnly
                      sx={{
                        fontSize: '20px',
                        color: '#D93A3F'
                      }}
                    />
                  </div>
                  <div className='rewiev'>
                    <ReviewsSVG />
                    <span>{t('selectedProductsPage.reviews', { count: 23 })}</span>
                  </div>
                </div>*/}
                <div className="itemInfo__rating">{product.volume.volume}</div>
                {product.volume.discount > 0 && (
                  <div className="itemInfo__discount">
                    <div className="prevPrice">{product.volume.price}</div>
                    <div className="discount">{product.volume.discount}</div>
                  </div>
                )}
                <div className="itemInfo__currentPrice">{product.volume.priceWithDiscount}</div>
              </div>
              <div className="itemDelete">
                <button onClick={() => delWithBasket(product.id)}>
                  <BasketSVG color={'red'} width={21} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <TabNavigation lang={lang} />
    </div>
  );
};
export default SelectedProductsPage;
