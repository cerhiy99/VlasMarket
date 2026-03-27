'use client';
import AddCategory from '@/app/components/Admin/Category/AddCategory';
import React from 'react';
import './AddProduct.scss';
import dynamic from 'next/dynamic';

const AddGoodsPage = dynamic(() => import('../../../../components/Admin/add-product/AddProduct'), {
  ssr: false,
});
type Props = {};

const page = (props: Props) => {
  return (
    <div className="add-product-container">
      <AddGoodsPage />
    </div>
  );
};

export default page;
