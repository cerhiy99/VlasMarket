'use client';
import { $host } from '@/app/http';
import { RootState } from '@/app/store';
import {
  addToComparisont,
  removeFromComparisont,
  removeFromLike,
} from '@/app/store/reducers/cartReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
  goods: any;
  selectVolumeIdx: number;
};

const Comparison = ({ goods, selectVolumeIdx }: Props) => {
  const [isInLike, setisInLike] = useState(false);

  const { comparison: like } = useSelector(
    (state: RootState) => state.BasketAndLike
  );

  const dispatch = useDispatch();

  useEffect(() => {
    setisInLike(like.findIndex((x) => x.id == goods.id) != -1);
  }, [like]);

  const getGoods = async (idVolume: number, idGoods: number) => {
    try {
      const res = await $host.get(
        `goods/GetForBasketOrLike?idVolume=${idVolume}&idGoods=${idGoods}`
      );
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const inLike = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInLike) {
      const selectGoods: any = await getGoods(
        goods.volumes[selectVolumeIdx].id,
        goods.id
      );
      const goodToLike = {
        id: selectGoods.id,
        nameUA: selectGoods.nameuk,
        nameRU: selectGoods.nameru,
        volume: {
          id: selectGoods.volumes[0].id,
          img: selectGoods.volumes[0].imgs[0].img,
          price: selectGoods.volumes[0].price,
          discount: selectGoods.volumes[0].discount,
          priceWithDiscount: selectGoods.volumes[0].priceWithDiscount,
          volume:
            selectGoods.volumes[0].volume + selectGoods.volumes[0].nameVolume,
          url: selectGoods.volumes[0].url,
        },
      };
      dispatch(addToComparisont(goodToLike));
    } else {
      dispatch(removeFromComparisont(goods.id));
    }
  };

  return (
    <div
      onClick={inLike}
      className={`like-container ${isInLike ? 'liked' : ''}`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.5833 19.25H6.41663M11 2.75L11 19.25M19.25 6.41667H17.4166C15.5833 6.41667 12.8333 5.5 11 4.58333C9.16663 5.5 6.41663 6.41667 4.58329 6.41667H2.74996M7.33329 14.6667L4.58329 7.33333L1.83329 14.6667C2.63079 15.2625 3.59329 15.5833 4.58329 15.5833C5.57329 15.5833 6.53579 15.2625 7.33329 14.6667ZM20.1666 14.6667L17.4166 7.33333L14.6666 14.6667C15.4641 15.2625 16.4266 15.5833 17.4166 15.5833C18.4066 15.5833 19.3691 15.2625 20.1666 14.6667Z"
          stroke="#7F7F7F"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

export default Comparison;
