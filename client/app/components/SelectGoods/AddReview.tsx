'use client'
import React, { useState } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import './AddReview.scss'
import { $authHost } from '@/app/http'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { GrUpdate } from 'react-icons/gr'
import { Rating } from '@mui/material'

type Props = {
  dictionary: any
  goodsId: number
}

const AddReview = ({ dictionary, goodsId }: Props) => {
  const { isAuthorize } = useSelector((state: RootState) => state.user)
  const [comment, setComment] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [isCaptchaGet, setIsCaptchaGet] = useState<boolean>(false)
  const [rating, setRating] = useState<null | number>(null)
  const [selectSvg, setSelectSvg] = useState('')
  const [captchaValue, setCaptchaValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [message, setMessage] = useState('')

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setErrorMessage('')
    if (!isCaptchaGet) {
      updateCaptcha()
      return
    } else {
      try {
        const res = await $authHost.post('review/sendReview', {
          captchaText: captchaValue,
          comment,
          goodsId,
          reviewId: null,
          rating
        })

        if (res.status == 250) {
          setErrorMessage('Не вірно введена капча.')
          updateCaptcha()
        } else {
          setIsCaptchaGet(false)
          setComment('')
          setRating(null)
          setMessage('Відгук успішно додано')
          setTimeout(togglePanel, 1500)
        }
      } catch (err) {
        setErrorMessage('Невідома помилка.')
      }
    }
  }
  return (
    <div id='addReview' className='leave-review'>
      <div className='leave-review-title'>
        <p>{dictionary.leaveReviesText}</p>
        <button onClick={togglePanel}>{dictionary.leaveRevies}</button>
      </div>
      {/* Панелька з формою */}
      <div className={`review-panel ${isOpen ? 'open' : ''}`}>
        {isAuthorize ? (
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder='Напишіть свій відгук тут...'
              required
              className='review-input'
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <Rating
              name='size-medium'
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue)
              }}
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
            <button onClick={handleSubmit} type='submit' className='submit-btn'>
              Надіслати відгук
            </button>
          </form>
        ) : (
          <div className='review-no-authorize'>
            Щоб залишити відгук спочатку потрібно авторизуватися.
          </div>
        )}
      </div>
    </div>
  )
}

export default AddReview

/*<HCaptcha
  sitekey='YOUR_HCAPTCHA_SITEKEY'
  onVerify={token => setCaptchaToken(token)}
/>*/
