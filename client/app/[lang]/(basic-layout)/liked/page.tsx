'use client';
import { use, useEffect, useState } from 'react';
import './Like.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Locale } from '@/i18n.config';
import { RootState } from '@/app/store';
import { $host } from '@/app/http';
import ListGoods from '@/app/components/goods/ListGoods';
import { addToBasket, removeFromLike } from '@/app/store/reducers/cartReducer';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const page = ({ params }: Props) => {
  const { lang } = use(params);
  const { like } = useSelector((state: RootState) => state.BasketAndLike);
  const [fullGoods, setFullGoods] = useState([]);
  const getFullGoods = async () => {
    try {
      const res = await $host.get(
        'goods/getMiniGoods?goodsIdes=' + JSON.stringify(like.map((x) => x.id))
      );
      setFullGoods(res.data.goods);
    } catch (err) {
      console.error('Помилка ', err);
    }
  };

  useEffect(() => {
    if (like.length > 0) getFullGoods();
  }, [like]);

  const dispatch = useDispatch();

  const buyOll = () => {
    like.forEach((x) => {
      dispatch(addToBasket({ ...x, count: 1 }));
      dispatch(removeFromLike(x.id));
    });
  };

  return (
    <div className="like-page-container">
      <h1>{lang == 'ru' ? 'Список желаний' : 'Список бажань'}</h1>
      {like.length == 0 ? (
        <h2>Список бажань пустий</h2>
      ) : (
        <ListGoods lang={lang} isFilter data={fullGoods} />
      )}
      {like.length > 0 && (
        <div className="footer-like">
          <div className="info">{like.length} товарів на суму </div>
          <div className="sum">
            {like.reduce((acc, x) => (acc += x.volume.priceWithDiscount), 0)}{' '}
            <span>₴</span>
          </div>
          <button onClick={buyOll}>Купити все</button>
        </div>
      )}
    </div>
  );
};

export default page;
