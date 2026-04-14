import AddLine from '@/app/components/Admin/line/AddLine';
import React from 'react';
import './Line.scss';
import EditAndDelLine from '@/app/components/Admin/line/EditAndDelLine';

const page = () => {
  return (
    <div className="line-container">
      <AddLine />
      <EditAndDelLine />
    </div>
  );
};

export default page;
