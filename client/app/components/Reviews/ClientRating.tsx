'use client'
import { Rating } from '@mui/material'
import React from 'react'
import './ClientRating.scss'

type Props = {
  name: string
  defaultValue: number
  precision: number
  isReadOnly: boolean
  size: number
}

const ClientRating = ({
  name,
  defaultValue,
  precision,
  isReadOnly,
  size
}: Props) => {
  return (
    <div className='client-rating-container'>
      <Rating
        name={name}
        defaultValue={defaultValue}
        precision={precision}
        readOnly
        style={{ fontSize: `${size}px` }}
      />
    </div>
  )
}

export default ClientRating
