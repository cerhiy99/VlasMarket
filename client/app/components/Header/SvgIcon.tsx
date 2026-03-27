'use client'
import React, { useEffect, useState } from 'react'

const SvgIcon = ({ url }: { url: string }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null)

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const res = await fetch(url)
        const text = await res.text()
        setSvgContent(text)
      } catch (err) {
        console.error('Помилка завантаження SVG:', err)
      }
    }

    fetchSvg()
  }, [url])

  if (!svgContent) return null

  return (
    <div
      className='svg-wrapper'
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}

export default SvgIcon
