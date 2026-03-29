import React from 'react';
import BurgerSVG from '../../../assest/Header/Burger/Burger.svg';

type Props = {};

const Burger = (props: Props) => {
  return (
    <div className="burger-container">
      <div
        style={{
          width: '40px',
          height: '40px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4.8px',
        }}
        className="burger-svg-container"
      >
        <BurgerSVG />
      </div>
    </div>
  );
};

export default Burger;
