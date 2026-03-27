'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const AddCountryMade = dynamic(
  () => import('../../../../components/Admin/add-product/AddCountryMade'),
  { ssr: false }
);

const page = () => {
  return (
    <div>
      <AddCountryMade />
    </div>
  );
};

export default page;
