'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Locale } from '@/i18n.config';

const EditOrderPage = dynamic(
  () => import('../../../../../[lang]/(admin-layout)/admin/orders/new-order/EditOrderPage'),
  { ssr: false }
);

type Props = {
  params: Promise<{ lang: Locale }>;
};

const page = ({ params }: Props) => {
  return (
    <div>
      <EditOrderPage params={params} />
    </div>
  );
};

export default page;
