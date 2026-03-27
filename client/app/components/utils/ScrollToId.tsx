'use client'
import React from 'react'

const ScrollToId = ({
  children,
  id
}: {
  children: React.ReactNode
  id: string
}) => {
  const scrollToId = () => {
    const elem = document.getElementById(id)
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div onClick={scrollToId} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  )
}

export default ScrollToId
