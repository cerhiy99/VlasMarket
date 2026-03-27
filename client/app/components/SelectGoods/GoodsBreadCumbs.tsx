import { Locale } from '@/i18n.config'
import Link from 'next/link'
import React from 'react'
import RightSVG from '../../assest/Goods/Right.svg'
import { getDictionary } from '@/lib/dictionary'
import './GoodsBreadCumbs.scss'
import { getLocalizedPath } from '../utils/getLocalizedPath'

type Props = {
  lang: Locale
  listUrl: { url: string; name: string }[]
}

const GoodsBreadCumbs = async ({ lang, listUrl }: Props) => {
  const { urls } = await getDictionary(lang)
  return (
    <div className='goods-bread-crumbs-container'>
      <Link href={getLocalizedPath(`/${lang}`,lang)}>{urls.main}</Link>
      {listUrl.slice(0, listUrl.length - 1).map((x, idx) => (
        <div key={idx} className='list-urls'>
          <RightSVG /> <Link href={getLocalizedPath(x.url,lang)}>{x.name}</Link>
        </div>
      ))}
      <div className='list-urls'>
        <RightSVG /> {listUrl[listUrl.length - 1].name}
      </div>
    </div>
  )
}

export default GoodsBreadCumbs
