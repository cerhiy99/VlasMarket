'use client';
import { $authHost } from '@/app/http';
import { RootState } from '@/app/store';
import React from 'react';
import { useSelector } from 'react-redux';

type Props = {
  id: number;
};

const DelBlog = ({ id }: Props) => {
  const { isAuthorize, user } = useSelector((state: RootState) => state.user);
  if (isAuthorize && user?.adminAccess != 'user') {
    const delBlog = async () => {
      try {
        const res = await $authHost.post(`blog/del/${id}`);
        alert('Видалено');
      } catch (err) {
        console.log(err);
        alert('Помилка');
      }
    };
    return (
      <div>
        <button onClick={delBlog}>Видалити</button>
      </div>
    );
  } else return null;
};

export default DelBlog;
