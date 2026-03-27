'use client'
import React from 'react'
import StarSVG from '../../assest/Reviews/Star.svg'

type Props = {
  listReviews: {
    author_name: string
    author_url: string
    language: string
    original_language: string
    profile_photo_url: string
    rating: number
    relative_time_description: string
    text: string
    time: number
    translated: boolean
  }[]
  dictionary: any
}

const ListReviews = ({ listReviews, dictionary }: Props) => {
  return (
    <div className='list-reviews-container'>
      <div className='list-reviews'>
        {listReviews.map(x => (
          <div key={x.author_name} className='review'>
            <div className='img'>
              <img src={x.profile_photo_url} alt={x.author_name} />
            </div>
            <div className='text'>
              <div className='name'> {x.author_name}</div>
              <div className='time'>{x.relative_time_description}</div>
              <div className='rating'>
                <StarSVG />
                <StarSVG />
                <StarSVG />
                <StarSVG />
                <StarSVG />
              </div>
              <div className='description'>{x.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className='updated'>
        <button>{dictionary.updated}</button>
      </div>
    </div>
  )
}

export default ListReviews
