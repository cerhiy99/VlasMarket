'use client';
import React, { useEffect, useState } from 'react';
import './CardWithImg.scss';
import ImgContainer from './ImgContainer';
import SelectGoodsTextContainer from './SelectGoodsTextContainer';
import { Locale } from '@/i18n.config';
import StaticListTitle from './StaticListTitle';
import { GoodInterface } from '@/app/interfaces/goods';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import SetView from './SetView';
import ListGoodsLeftWithRealGoods from '../Home/ListGoodsLeftWithRealGoods';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';

const AboutGoods = dynamic(() => import('./AboutGoods'), { ssr: false });

const CardWithImg = ({
  dictionary,
  selectGoods,
  lang,
  defaultIndexVolume,
  selectVolumeId,
  watchMore,
  reviews,
  searchParams,
}: {
  dictionary: any;
  selectGoods: GoodInterface;
  lang: Locale;
  defaultIndexVolume: number;
  selectVolumeId: number;
  watchMore: any;
  reviews: any;
  searchParams: any;
}) => {
  const [selectVolumeIdx, setSelectVolumeIdx] = useState(defaultIndexVolume);
  const { t } = useTranslation();
  const router = useRouter();
  const setVolume = (value: number) => {
    setSelectVolumeIdx(value);
  };
  const [activeSection, setActiveSection] = useState<
    'about' | 'description' | 'characteristics' | 'reviews' | 'video' | 'similar'
  >('about');

  const { user, isAuthorize } = useSelector((state: RootState) => state.user);
  useEffect(() => {}, [searchParams]);

  return (
    <>
      <div className="card-with-img-container">
        <StaticListTitle
          selectVolume={selectVolumeIdx}
          selectGoods={selectGoods}
          dictionary={dictionary}
          onChanegeSection={setActiveSection}
          sectionName={activeSection}
          lang={lang}
        />
        <div className="img-and-text-containers">
          <div className="card-with-img-main">
            <ImgContainer
              listImg={selectGoods.volumes[selectVolumeIdx].imgs}
              isNovetly={selectGoods.isNovetly}
              isFreeDelivery={selectGoods.volumes[selectVolumeIdx].isFreeDelivery}
              isDiscount={selectGoods.isDiscount}
              isHit={selectGoods.isHit}
              lang={lang}
            />
          </div>
          <SelectGoodsTextContainer
            lang={lang}
            setVolume={setVolume}
            selectVolume={selectVolumeIdx}
            dictionary={dictionary}
            selectGoods={selectGoods}
            selectVolumeId={selectVolumeId}
            reviews={reviews}
          />
        </div>
        {isAuthorize && user?.adminAccess !== 'user' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 600,
                transition: 'background-color 0.3s ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
              onClick={() =>
                router.push(
                  getLocalizedPath(`/${lang}/admin/update-product/${selectGoods.id}`, lang)
                )
              }
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#005bb5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0070f3')}
            >
              {t('selectGoods.edit')}
            </button>
            <p>Переглядів: {selectGoods.views}</p>
          </div>
        )}
      </div>
      <div className="pc-watch-more">
        <div className="card-with-image__text_h2">
          <p className="h2">{t('selectGoods.watchMore')}</p>
        </div>
        <ListGoodsLeftWithRealGoods data={watchMore} lang={lang} dictionary={dictionary.SeeMore} />
      </div>
      {/* <SeeMore
        listGoods={selectGoods.listGoods}
        lang={lang}
        dictionary={dictionary.SeeMore}
      /> */}
      <AboutGoods
        selectVolume={selectVolumeIdx}
        selectGoods={selectGoods}
        dictionary={dictionary.aboutProduct}
        sectionName={activeSection}
        lang={lang}
        revie={reviews}
        watchMore={watchMore}
      />
      <SetView id={selectGoods.id} />
    </>
  );
};

export default CardWithImg;
