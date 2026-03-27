import React, { useState } from 'react'
import './Review.scss'
import ClientRating from '../Reviews/ClientRating'
import BasketTrue from '../../assest/Goods/BasketTrue.svg'
import ReactionSVG from '../../assest/Goods/Reaction.svg'
import ThumbsUpSVG from '../../assest/Goods/ThumbsUp.svg'
import ThumbsDownSVG from '../../assest/Goods/ThumbsDown.svg'
import Image from 'next/image'
import { $authHost } from '@/app/http'
import { GrUpdate } from 'react-icons/gr'

type Props = {
  review: {
    id: number
    name: string
    description: string
    countStar: number
    img: string
    disadvantages: string
    date: string
    child: any[]
  }
  goodsId: number
  isChild?: true
}

const Review = ({ review, goodsId, isChild }: Props) => {
  const [isRespond, setIsRespond] = useState(false)
  const [respond, setRespond] = useState('')

  const [captchaValue, setCaptchaValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [message, setMessage] = useState('')
  const [isCaptchaGet, setIsCaptchaGet] = useState<boolean>(false)
  const [selectSvg, setSelectSvg] = useState('')

  const updateCaptcha = async () => {
    try {
      setCaptchaValue('')
      const res = await $authHost.post('review/startWriteComment', { goodsId })
      setIsCaptchaGet(true)
      setSelectSvg(res.data)
      return
    } catch (err) {
      alert('Помилка')
    }
  }

  const sendRespond = async () => {
    setMessage('')
    setErrorMessage('')
    if (!isCaptchaGet) {
      updateCaptcha()
      return
    } else {
      try {
        const res = await $authHost.post('review/sendReview', {
          captchaText: captchaValue,
          comment: respond,
          goodsId,
          reviewId: review.id,
          rating: null
        })
        if (res.status == 250) {
          setErrorMessage('Не вірно введена капча.')
          updateCaptcha()
        } else {
          setIsCaptchaGet(false)
          setRespond('')
          setMessage('Ваша відповідь успішно надіслана')
          setTimeout(() => setIsRespond(false), 1500)
        }
      } catch (err) {
        setErrorMessage('Невідома помилка.')
      }
    }
  }

  return (
    <div className={`review-container ${isChild ? 'child' : ''}`}>
      <div className='rating-and-additional-info'>
        {!isChild && (
          <ClientRating
            name='half-rating-read'
            defaultValue={review.countStar}
            precision={1}
            isReadOnly={true}
            size={16}
          />
        )}
        <div className='date'>{review.date.slice(0, 10)}</div>
        {/*<div className='basket-true'>
          <BasketTrue /> Куплено в BAYLAP
        </div>*/}
      </div>

      <div className='review'>
        <h4>{review.name}</h4>
        <p>{review.description}</p>
        {/* <div className='review-img'>
          <Image
            src={process.env.NEXT_PUBLIC_SERVER + review.img}
            alt=''
            width={57}
            height={57}
          />
        </div>
       <div className='disadvantages'>
          Недоліки: <span>{review.disadvantages}</span>
        </div>*/}
        {!isChild && (
          <div onClick={() => setIsRespond(!isRespond)} className='reaction'>
            <p>
              <ReactionSVG /> Відповісти
            </p>
            {/*<div className='reaction-thumbs'>
            <ThumbsUpSVG />
            <div className='line' />
            <ThumbsDownSVG />
          </div>*/}
          </div>
        )}
        {!isChild && isRespond && (
          <div className='respond-container'>
            <div className='resend-form'>
              <label htmlFor='description'>Ваша відповідь</label>
              <textarea
                value={respond}
                onChange={e => setRespond(e.target.value)}
              />
              {isCaptchaGet && (
                <>
                  <div className='captcha-cont'>
                    <div className='captcha'>
                      <div
                        className='svg'
                        dangerouslySetInnerHTML={{ __html: selectSvg }}
                      />
                      <div
                        className='svg-update-captcha'
                        onClick={() => updateCaptcha()}
                      >
                        <GrUpdate size={20} />
                      </div>
                    </div>
                    <input
                      value={captchaValue}
                      onChange={e => setCaptchaValue(e.target.value)}
                    />
                  </div>
                </>
              )}
              {errorMessage && (
                <>
                  <div style={{ color: 'red' }}>{errorMessage}</div>
                  <br />
                </>
              )}
              {message && (
                <>
                  <div style={{ color: 'green' }}>{message}</div>
                  <br />
                </>
              )}
              <div className='but-center'>
                <button onClick={sendRespond}>Отправить</button>
              </div>
            </div>
          </div>
        )}
        {!isChild && (
          <div className='list-child'>
            {review.child.map(x => (
              <div key={x.id} className='review-child'>
                <Review isChild review={x} goodsId={goodsId} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Review
