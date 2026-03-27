'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import AddCategory from '@/app/components/Admin/Category/AddCategory';

const AddCategoryFilter = dynamic(
  () => import('../../../../components/Admin/add-product/AddCategoryFilter'),
  { ssr: false }
);

const page = () => {
  return (
    <div>
      <AddCategoryFilter />
    </div>
  );
};

export default page;
