import React from 'react'
import BurgerSVG from '../../../assest/Header/Burger/Burger.svg'

type Props = {}

const Burger = (props: Props) => {
  return (
    <div className='burger-container'>
      <div className='burger-svg-container'>
        <BurgerSVG />
      </div>
    </div>
  )
}

export default Burger
