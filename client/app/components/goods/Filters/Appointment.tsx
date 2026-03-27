'use client'
import React, { useState, useEffect, useRef } from 'react'
import './Brends.scss'
import UpSVG from '../../../assest/Filters/Up.svg'
import DownSVG from '../../../assest/Filters/Down.svg'

type AppointmentOption = {
  id: number
  name: string
}

const Appointment: React.FC = () => {
  const initialAppointments: AppointmentOption[] = [
    { id: 1, name: 'Зволоження' },
    { id: 2, name: 'Живлення' },
    { id: 3, name: 'Антивіковий догляд' },
    { id: 4, name: 'Очищення' },
    { id: 5, name: 'Відбілювання' },
    { id: 6, name: 'Захист від сонця' },
    { id: 7, name: 'Лікування акне' },
    { id: 8, name: 'Ексфоліація' },
    { id: 9, name: 'Догляд за очима' },
    { id: 10, name: 'Догляд за волоссям' },
    { id: 11, name: 'Зняття макіяжу' },
    { id: 12, name: 'Освітлення' },
    { id: 13, name: 'Зменшення пор' },
    { id: 14, name: 'Зменшення почервоніння' },
    { id: 15, name: 'Заспокоєння шкіри' }
  ].sort((a, b) => a.name.localeCompare(b.name, 'uk'))

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedAppointments, setSelectedAppointments] = useState<
    Record<number, boolean>
  >({})
  const [selectedLetter, setSelectedLetter] = useState<string>('А')
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024)
  const scrollContainerRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleCheckboxChange = (appointmentId: number) => {
    setSelectedAppointments(prevState => ({
      ...prevState,
      [appointmentId]: !prevState[appointmentId]
    }))
  }

  const toggleOpen = () => setIsOpen(prev => !prev)

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter)

    const list = scrollContainerRef.current
    if (list) {
      const targetElement = Array.from(list.children).find(child => {
        const appointmentName = (child as HTMLElement).innerText.trim()
        return appointmentName.startsWith(letter)
      })
      if (targetElement) {
        list.scrollTo({
          top: (targetElement as HTMLElement).offsetTop - list.offsetTop,
          behavior: 'smooth'
        })
      }
    }
  }

  // Український алфавіт
  const alphabet = 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ'.split('')

  return (
    <div className='brands-container'>
      <div
        style={{ minWidth: '110px' }}
        className='brands-header'
        onClick={toggleOpen}
      >
        <span>ПРИЗНАЧЕННЯ</span>
        <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? <UpSVG /> : <DownSVG />}
        </span>
      </div>
      {isOpen && (
        <div style={{ left: '5px' }} className={isMobile ? 'dropdown' : ''}>
          <ul className='brands-list filter-scroll' ref={scrollContainerRef}>
            {initialAppointments.map(appointment => (
              <li key={appointment.id} className='brand-item'>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <input
                    type='checkbox'
                    checked={selectedAppointments[appointment.id] || false}
                    onChange={() => handleCheckboxChange(appointment.id)}
                    style={{ display: 'none' }}
                  />
                  <span className='custom-checkbox'></span>
                  <span className='brand-name'>{appointment.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Appointment
