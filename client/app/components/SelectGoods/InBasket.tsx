import React from 'react'
import BasketBig from '../../assest/Goods/BasketBig.svg'
import './InBasket.scss'

type Props = {
  children: any
  id: number
}

const InBasket = ({ children, id }: Props) => {
  return <div className='in-basket-container'>{children}</div>
}

export default InBasket
