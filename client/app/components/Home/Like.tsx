'use client';
import { $host } from '@/app/http';
import { RootState } from '@/app/store';
import { addToLike, removeFromLike } from '@/app/store/reducers/cartReducer';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
  goods: any;
  selectVolumeIdx: number;
};

const Like = ({ goods, selectVolumeIdx }: Props) => {
  const [isInLike, setisInLike] = useState(false);

  const { like } = useSelector((state: RootState) => state.BasketAndLike);

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
      dispatch(addToLike(goodToLike));
    } else {
      dispatch(removeFromLike(goods.id));
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
          d="M20.1667 8.70882C20.1667 7.68875 19.8573 6.69269 19.2793 5.85218C18.7013 5.01167 17.8819 4.36625 16.9294 4.00118C15.9769 3.63611 14.9361 3.56856 13.9444 3.80744C12.9527 4.04632 12.0568 4.58041 11.375 5.33915C11.327 5.3905 11.2689 5.43143 11.2044 5.45942C11.1399 5.4874 11.0704 5.50184 11.0001 5.50184C10.9298 5.50184 10.8602 5.4874 10.7957 5.45942C10.7312 5.43143 10.6732 5.3905 10.6252 5.33915C9.94551 4.57548 9.04939 4.0369 8.05608 3.79512C7.06277 3.55333 6.01938 3.6198 5.06478 3.98568C4.11018 4.35155 3.28965 4.99948 2.71239 5.84323C2.13514 6.68697 1.82854 7.68651 1.83341 8.70882C1.83341 10.808 3.20841 12.3755 4.58341 13.7505L9.61775 18.6207C9.78855 18.8169 9.99915 18.9745 10.2355 19.083C10.4719 19.1915 10.7287 19.2485 10.9888 19.2502C11.2489 19.2518 11.5064 19.1981 11.7442 19.0926C11.9819 18.987 12.1945 18.8321 12.3677 18.6382L17.4167 13.7505C18.7917 12.3755 20.1667 10.8172 20.1667 8.70882Z"
          stroke="#7F7F7F"
          stroke-width="1.83333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

export default Like;
