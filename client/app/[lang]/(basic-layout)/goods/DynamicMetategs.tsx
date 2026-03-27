'use client'
import { useEffect, useState } from 'react'

interface Props {
  lang: 'ua' | 'ru'
  page?: number
}

export default function GoodsPageHead({ lang, page = 1 }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const urlPath = lang === 'ua' ? '' : '/ru'
  const canonicalUrl = `${baseUrl}${urlPath}/goods?page=${page}`

  const titles = {
    ua: `Каталог товарів — сторінка ${page} | Baylap`,
    ru: `Каталог товаров — страница ${page} | Baylap`,
  }

  const descriptions = {
    ua: `Перегляньте сторінку ${page} каталогу товарів інтернет-магазину Baylap.`,
    ru: `Посмотрите страницу ${page} каталога товаров интернет-магазина Baylap.`,
  }

  if (!mounted) return null // чекаємо, поки компонент змонтується

  return (
    <head>
      <title>{titles[lang]}</title>
      <meta name="description" content={descriptions[lang]} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={titles[lang]} />
      <meta property="og:description" content={descriptions[lang]} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Baylap" />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/goods`} />
      <link rel="alternate" hrefLang="uk" href={`${baseUrl}/goods`} />
      <link rel="alternate" hrefLang="ru" href={`${baseUrl}/ru/goods`} />
    </head>
  )
}
