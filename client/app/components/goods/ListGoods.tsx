import React from 'react';
import MiniGoods from '../Home/MiniGoods';
import { Locale } from '@/i18n.config';
import './ListGoods.scss';
import { GoodInterface } from '@/app/interfaces/goods';

const ListGoods = ({
  lang,
  dictionary,
  isFilter,
  data,
}: {
  lang: Locale;
  dictionary?: any;
  isFilter: boolean;
  data: GoodInterface[];
}) => {
  return (
    <div
      className={`${
        isFilter ? 'list-goods-container4' : 'list-goods-container4-no-filter'
      }`}
    >
      {data.map(
        (x) =>
          x.volumes.length > 0 && (
            <MiniGoods
              lang={lang}
              dictionary={dictionary}
              goods={x}
              key={x.id}
            />
          )
      )}
    </div>
  );
};

export default ListGoods;
