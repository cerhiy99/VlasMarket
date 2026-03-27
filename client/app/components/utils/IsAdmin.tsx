'use client';
import { RootState } from '@/app/store';
import React from 'react';
import { useSelector } from 'react-redux';

type Props = { children: any };

const IsAdmin = ({ children }: Props) => {
  const { isAuthorize } = useSelector((state: RootState) => state.user);
  const adminAccess = useSelector(
    (state: RootState) => state.user.user?.adminAccess,
  );

  if (isAuthorize && adminAccess == 'owner') {
    return children;
  } else {
    return null;
  }
};

export default IsAdmin;
