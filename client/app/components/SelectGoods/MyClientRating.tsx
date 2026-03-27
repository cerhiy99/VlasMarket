import React from 'react'
import StarSVG from '../../assest/Goods/Star.svg'
import './MyClientRating.scss'

type Props = {
  value: number
}

const MyClientRating = ({ value }: Props) => {
  return (
    <div className='my-client-rating'>
      {new Array(value).fill(0).map((x, idx) => (
        <StarSVG key={idx} />
      ))}
    </div>
  )
}

export default MyClientRating
