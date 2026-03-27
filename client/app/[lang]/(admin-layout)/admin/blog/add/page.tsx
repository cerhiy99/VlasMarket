'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const AddBlog = dynamic(() => import('./AddBlog'), { ssr: false });

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AddBlog />
    </div>
  );
};

export default page;
