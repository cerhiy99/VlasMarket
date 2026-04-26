import React from 'react';
import AddPromokods from './AddPromokods';
import './Promokods.scss';
import GetPromokods from './GetPromokods';

type Props = {};

const page = (props: Props) => {
  return (
    <div className="promokods">
      <GetPromokods />
      <AddPromokods />
    </div>
  );
};

export default page;
