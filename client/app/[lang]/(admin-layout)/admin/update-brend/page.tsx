'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const UpdateBrend = dynamic(() => import('./UpdateBrend'), { ssr: false });

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <UpdateBrend />
    </div>
  );
};

export default page;
