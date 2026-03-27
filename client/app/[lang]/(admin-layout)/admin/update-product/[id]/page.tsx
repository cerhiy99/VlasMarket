'use client';
import React, { use } from 'react';
import dynamic from 'next/dynamic';
const UpdateProduct = dynamic(() => import('./UpdateProduct'), { ssr: false });

type Props = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: Props) => {
  const { id } = use(params);
  return (
    <div>
      <UpdateProduct id={id} />
    </div>
  );
};

export default page;
