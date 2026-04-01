'use client';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import { logout } from '@/app/store/reducers/userReducers';
import { Locale } from '@/i18n.config';
import { useRouter } from 'next/navigation';
import React, { use, useEffect } from 'react';
import { useDispatch } from 'react-redux';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const page = ({ params }: Props) => {
  const { lang } = use(params);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(logout());
    router.push(getLocalizedPath(`/${lang}/`, lang));
  }, []);
  return null;
};

export default page;
