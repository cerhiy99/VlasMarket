'use client'

import type React from 'react'

import { useState } from 'react'
import './AccordionMenu.scss'

type AccordionMenuProps = {
  children: React.ReactNode
  emptyMessage: string
  isOpen: boolean
  isEmpty?: boolean
  innerMessage?: string
}

const AccordionMenu = ({
  children,
  emptyMessage,
  isEmpty = false,
  isOpen,
  innerMessage
}: AccordionMenuProps) => {
  return (
    <div className='accordion-menu'>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className='innerMessage'>{innerMessage}</div>
        <div className='accordion-inner'>
          {isEmpty ? (
            <div className='empty-message'>{emptyMessage}</div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  )
}

export default AccordionMenu
