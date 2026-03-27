'use client';
import { RootState } from '@/app/store';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './AdminLogo.scss';

type Props = {
  isMob?: true;
};

const AdminLogo = ({ isMob }: Props) => {
  const { isAuthorize, user } = useSelector((state: RootState) => state.user);
  useEffect(() => {}, [isAuthorize, user]);

  if (isAuthorize && user?.adminAccess == 'owner') {
    return (
      <Link
        style={
          isMob
            ? {
                width: '35px',
                height: '35px',
                border: '1px solid rgb(0, 112, 243)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '100%',
                textDecoration: 'none',
                color: 'rgb(0, 112, 243)',
              }
            : {
                position: 'absolute',
                left: '17px',
                top: '17px',
                display: 'flex',
                alignContent: 'center',
                textDecoration: 'none',
                color: 'rgb(0, 112, 243)',
                border: '1px solid rgb(0, 112, 243)',
                padding: '5px 10px',
                borderRadius: '100%',
                fontWeight: 700,
              }
        }
        href={`/ru/admin`}
        className={!isMob ? 'admin-logo-pc' : ''}
      >
        A
      </Link>
    );
  } else if (isAuthorize && user?.adminAccess == 'admin') {
    return (
      <Link
        style={
          isMob
            ? {
                width: '35px',
                height: '35px',
                border: '1px solid rgb(0, 112, 243)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '100%',
                textDecoration: 'none',
                color: 'rgb(0, 112, 243)',
              }
            : {
                position: 'absolute',
                left: '17px',
                top: '17px',
                display: 'flex',
                alignContent: 'center',
                textDecoration: 'none',
                color: 'rgb(0, 112, 243)',
                border: '1px solid rgb(0, 112, 243)',
                padding: '5px 10px',
                borderRadius: '100%',
                fontWeight: 700,
              }
        }
        href={`/ru/admin/orders-for-manager`}
        className={!isMob ? 'admin-logo-pc' : ''}
      >
        M
      </Link>
    );
  } else return null;
};

export default AdminLogo;
