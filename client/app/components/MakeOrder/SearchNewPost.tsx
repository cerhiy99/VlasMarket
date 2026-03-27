'use client';
import React, { useEffect, useState } from 'react';
import './SearchNewPost.scss';
import ListNewPost from './ListNewPost';
import { useTranslation } from '@/context/TranslationProvider';
import { Locale } from '@/i18n.config';

type Props = {
  selectFinishDelivery: any;
  infoDelivery: any;
  lang: Locale;
};

const SearchNewPost = ({ selectFinishDelivery, infoDelivery, lang }: Props) => {
  const [typeDelivery, setTypeDelivery] = useState<
    'department' | 'post' | 'curier'
  >('department');
  useEffect(() => {
    if (!infoDelivery.typeDelivery) {
      setTypeDelivery('post');
      setTimeout(() => setTypeDelivery('department'), 500);
    }
  }, [infoDelivery]);
  const { t } = useTranslation();
  return (
    <div className="search-new-post-container">
      <fieldset>
        <div
          onClick={() => setTypeDelivery('department')}
          className="select-input"
        >
          <input
            checked={typeDelivery == 'department'}
            style={{ padding: 0, width: 'unset' }}
            type="radio"
          />
          <p>{t('makeOrder.delivery.toDepartment')}</p>
        </div>
        <div className="select-input" onClick={() => setTypeDelivery('post')}>
          <input
            checked={typeDelivery == 'post'}
            style={{ padding: 0, width: 'unset' }}
            type="radio"
          />
          <p>{t('makeOrder.delivery.postomat')}</p>
        </div>
        <div className="select-input" onClick={() => setTypeDelivery('curier')}>
          <input
            checked={typeDelivery == 'curier'}
            style={{ padding: 0, width: 'unset' }}
            type="radio"
          />
          <p>{t('makeOrder.delivery.courier')}</p>
        </div>
      </fieldset>
      <ListNewPost
        selectFinishDelivery={selectFinishDelivery}
        typeDelivery={typeDelivery}
        infoDelivery={infoDelivery}
        lang={lang}
      />
    </div>
  );
};

export default SearchNewPost;
