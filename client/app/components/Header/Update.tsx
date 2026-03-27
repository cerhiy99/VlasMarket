'use client'
import React, { useEffect } from 'react'

const Update = () => {
  const currentVersion = process.env.NEXT_PUBLIC_VERSION || '1.0.0' // Задайте поточну версію додатка

  useEffect(() => {
    const savedVersion = localStorage.getItem('version')

    if (savedVersion !== currentVersion) {
      // Збереження нової версії в localStorage
      localStorage.setItem('version', currentVersion)

      // Примусове перезавантаження сторінки
      location.reload()
    }
  }, [])

  return null
}

export default Update
