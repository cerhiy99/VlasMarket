'use client'
import React, { useState } from 'react'
import './ListImgReviewsBuys.scss'
import Image from 'next/image'
import { MdOutlineChevronLeft } from 'react-icons/md'
import { MdOutlineChevronRight } from 'react-icons/md'
import CloseSVG from '../../assest/Goods/Close.svg'

type Props = {
  listReviews: any[]
}

const ListImgReviewsBuys = ({ listReviews }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [indexShowImg, setIndexShowImg] = useState(0)
  const [selectUrl, setSelectUrl] = useState(listReviews[0].img)

  const left = () => indexShowImg != 0 && setIndexShowImg(indexShowImg - 1)

  const right = () =>
    listReviews.length - 1 != indexShowImg && setIndexShowImg(indexShowImg + 1)

  console.log(selectUrl)

  return (
    <div className='list-img-reviews-buys-container'>
      {listReviews.map(x => (
        <div key={x} className='img-buys'>
          <Image
            onClick={() => {
              setIsOpen(!isOpen)
              setSelectUrl(x)
            }}
            src={process.env.NEXT_PUBLIC_SERVER + x.img}
            alt='photo from the review'
            width={64}
            height={64}
          />
        </div>
      ))}
      {isOpen && (
        <div className='show-img'>
          <div className='show-img-container'>
            <div
              style={{ opacity: indexShowImg != 0 ? 1 : 0.2 }}
              onClick={left}
              className='arrow left'
            >
              <MdOutlineChevronLeft size={60} />
            </div>
            <Image
              width={1400}
              height={1400}
              alt='photo from the review'
              src={
                process.env.NEXT_PUBLIC_SERVER +
                [
                  selectUrl,
                  ...listReviews.filter((x: any) => x.img != selectUrl.img)
                ][indexShowImg].img
              }
            />
            <div
              onClick={() => {
                setIsOpen(false)
                setIndexShowImg(0)
              }}
              className='close'
            >
              <CloseSVG />
            </div>
            <div
              style={{
                opacity: listReviews.length - 1 != indexShowImg ? 1 : 0.2
              }}
              onClick={right}
              className='arrow right'
            >
              <MdOutlineChevronRight size={60} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListImgReviewsBuys
