'use client'

import React, { useState, useEffect } from 'react'
import './GenderSelector.scss'
import UpSVG from '../../../assest/Filters/Up.svg'
import DownSVG from '../../../assest/Filters/Down.svg'

type GenderOption = {
  id: number
  name: string
}

const GenderSelector: React.FC = () => {
  const initialGenders: GenderOption[] = [
    { id: 1, name: 'Мужской' },
    { id: 2, name: 'Женский' },
    { id: 3, name: 'Унисекс' }
  ]

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedGenders, setSelectedGenders] = useState<
    Record<number, boolean>
  >({})
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const toggleOpen = () => {
    setIsOpen(prev => !prev)
  }

  const handleCheckboxChange = (genderId: number) => {
    setSelectedGenders(prevState => ({
      ...prevState,
      [genderId]: !prevState[genderId]
    }))
  }

  return (
    <div className='gender-selector-container'>
      <div className='gender-selector-header' onClick={toggleOpen}>
        <span>ПОЛ</span>
        <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? <UpSVG /> : <DownSVG />}
        </span>
      </div>
      {isOpen && (
        <ul className={`gender-list ${isMobile ? 'dropdown' : ''}`}>
          {initialGenders.map(gender => (
            <li key={gender.id} className='gender-item'>
              <label>
                <input
                  type='checkbox'
                  checked={!!selectedGenders[gender.id]}
                  onChange={() => handleCheckboxChange(gender.id)}
                />
                <span className='custom-checkbox'></span>
                <span className='gender-name'>{gender.name}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GenderSelector
