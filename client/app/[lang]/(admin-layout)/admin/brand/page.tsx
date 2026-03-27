'use client';
import dynamic from 'next/dynamic';
const AddBrand = dynamic(() => import('../../../../components/Admin/add-product/AddBrend'), {
  ssr: false,
});

const page = () => {
  return (
    <div>
      <AddBrand />
    </div>
  );
};

export default page;
