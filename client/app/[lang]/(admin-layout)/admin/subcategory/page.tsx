'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import SortSubcategories from '@/app/components/Admin/Subcategory/SortSubcategories';
const AddSubcategory = dynamic(
  () => import('../../../../components/Admin/Subcategory/AddSubcategory'),
  {
    ssr: false, // Вимикає server-side rendering для цього компонента
  }
);
const UpdateSubcategory = dynamic(
  () => import('../../../../components/Admin/Subcategory/UpdateSubcategory'),
  {
    ssr: false, // Вимикає server-side rendering для цього компонента
  }
);

const page = () => {
  return (
    <div>
      <AddSubcategory />
      <UpdateSubcategory />
      <SortSubcategories />
    </div>
  );
};

export default page;
