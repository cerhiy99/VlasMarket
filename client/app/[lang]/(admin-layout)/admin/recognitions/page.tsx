import AddRecognition from '@/app/components/Admin/recognition/AddRecognition';
import React from 'react';
import './Recognitions.scss';
import EditRecognition from './EditRecognition';

const page = () => {
  return (
    <div className="recognitions-container">
      <AddRecognition />
      <EditRecognition />
    </div>
  );
};

export default page;
