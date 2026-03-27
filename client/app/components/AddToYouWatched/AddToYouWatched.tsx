'use client';
import { $host } from '@/app/http';
import { addToWatched, watcedItem } from '@/app/store/reducers/userWatched';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

type Props = {
  userWatch: number;
  idVolume: number;
};

const AddToYouWatched = ({ userWatch, idVolume }: Props) => {
  const dispatch = useDispatch();
  const getValue = async () => {
    try {
      const res = await $host.get(
        `goods/GetForBasketOrLike?idVolume=${idVolume}&idGoods=${userWatch}`,
      );
      dispatch(addToWatched(res.data));
    } catch (err) {}
  };
  useEffect(() => {
    getValue();
  }, []);
  return null;
};

export default AddToYouWatched;
