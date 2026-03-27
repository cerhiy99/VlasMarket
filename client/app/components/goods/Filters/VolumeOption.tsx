'use client'
import React, { useState, useEffect, useRef } from 'react'
import './VolumeSelector.scss'
import UpSVG from '../../../assest/Filters/Up.svg'
import DownSVG from '../../../assest/Filters/Down.svg'

type VolumeOption = {
  id: number
  name: string
}

const VolumeSelector: React.FC = () => {
  const initialVolumes: VolumeOption[] = [
    { id: 1, name: 'Aloe Vera 100 ml' },
    { id: 2, name: 'Apple Cider 200 ml' },
    { id: 3, name: 'Banana Shake 500 ml' },
    { id: 4, name: 'Coconut Water 750 ml' },
    { id: 5, name: 'Daily Essentials 1 L' },
    { id: 6, name: 'Energy Drink 1.5 L' },
    { id: 7, name: 'Fresh Orange 2 L' },
    { id: 8, name: 'Ginger Ale 300 ml' },
    { id: 9, name: 'Herbal Tea 250 ml' },
    { id: 10, name: 'Ice Coffee 500 ml' },
    { id: 11, name: 'Jasmine Green Tea 600 ml' },
    { id: 12, name: 'Kiwi Smoothie 1 L' },
    { id: 13, name: 'Lemonade 750 ml' },
    { id: 14, name: 'Mango Juice 500 ml' },
    { id: 15, name: 'Nut Milk 1.5 L' },
    { id: 16, name: 'Oat Milk 1 L' },
    { id: 17, name: 'Peach Iced Tea 2 L' },
    { id: 18, name: 'Quince Drink 300 ml' },
    { id: 19, name: 'Raspberry Water 750 ml' },
    { id: 20, name: 'Strawberry Lemonade 500 ml' },
    { id: 21, name: 'Tomato Juice 1 L' },
    { id: 22, name: 'Ube Shake 350 ml' },
    { id: 23, name: 'Vanilla Shake 600 ml' },
    { id: 24, name: 'Watermelon Drink 1.5 L' },
    { id: 25, name: 'Xtreme Energy 2 L' },
    { id: 26, name: 'Yogurt Smoothie 1 L' },
    { id: 27, name: 'Zucchini Juice 400 ml' },
    { id: 28, name: '1-Litre Milk' },
    { id: 29, name: '2-Litre Juice' },
    { id: 30, name: '3-Litre Lemonade' }
  ].sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    if (/^\d/.test(nameA) && !/^\d/.test(nameB)) return 1
    if (!/^\d/.test(nameA) && /^\d/.test(nameB)) return -1
    return nameA.localeCompare(nameB)
  })

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedVolumes, setSelectedVolumes] = useState<
    Record<number, boolean>
  >({})
  const [selectedLetter, setSelectedLetter] = useState<string>('A')
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024)
  const scrollContainerRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleCheckboxChange = (volumeId: number) => {
    setSelectedVolumes(prevState => ({
      ...prevState,
      [volumeId]: !prevState[volumeId]
    }))
  }

  const toggleOpen = () => setIsOpen(prev => !prev)

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter)

    const list = scrollContainerRef.current
    if (list) {
      const targetElement = Array.from(list.children).find(child => {
        const volumeName = (child as HTMLElement).innerText.trim()
        if (letter === '0-9') return /^\d/.test(volumeName)
        return volumeName.startsWith(letter)
      })
      if (targetElement) {
        list.scrollTo({
          top: (targetElement as HTMLElement).offsetTop - list.offsetTop,
          behavior: 'smooth'
        })
      }
    }
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['0-9'])

  return (
    <div className='brands-container'>
      <div className='brands-header' onClick={toggleOpen}>
        <span>ОБ&apos;ЄМ</span>
        <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? <UpSVG /> : <DownSVG />}
        </span>
      </div>
      {isOpen && (
        <div style={{ left: '-100px' }} className={isMobile ? 'dropdown' : ''}>
          <ul className='brands-list filter-scroll' ref={scrollContainerRef}>
            {initialVolumes.map(volume => (
              <li key={volume.id} className='brand-item'>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <input
                    type='checkbox'
                    checked={selectedVolumes[volume.id] || false}
                    onChange={() => handleCheckboxChange(volume.id)}
                    style={{ display: 'none' }}
                  />
                  <span className='custom-checkbox'></span>
                  <span className='brand-name'>{volume.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default VolumeSelector
