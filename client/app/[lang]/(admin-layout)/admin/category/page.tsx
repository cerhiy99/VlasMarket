'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import AddCategory from '@/app/components/Admin/Category/AddCategory';

const AddCountryMade = dynamic(
  () => import('../../../../components/Admin/add-product/AddCountryMade'),
  { ssr: false }
);
const UpdateCategory = dynamic(
  () => import('../../../../components/Admin/Category/UpdateCategory'),
  { ssr: false }
);

const page = () => {
  return (
    <div>
      <AddCategory />
      <UpdateCategory />
    </div>
  );
};

export default page;
