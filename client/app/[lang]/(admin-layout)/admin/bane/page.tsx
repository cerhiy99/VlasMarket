'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import EditSlide from './EditSlide';
import AddSlide from '@/app/components/Admin/baners/AddSlide';

const page = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '15px 0',
        gap: '30px',
      }}
    >
      <AddSlide />
      <EditSlide />
    </div>
  );
};

export default page;
