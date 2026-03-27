import React from 'react'
import MainSVG from '../../../assest/BreadCrumbs/Main.svg'
import NextSVG from '../../../assest/Admin/Next.svg'
import Link from 'next/link'
import { Locale } from '@/i18n.config'
import './AdminHeader.scss'
import { getLocalizedPath } from '../../utils/getLocalizedPath'

type Props = {
  lang: Locale
  url: string
  name: string
}

const AdminHeader = ({ lang, url, name }: Props) => {
  return (
    <div className='admin-header-container'>
      <div className='admin-header'>
        <div className='bread-crumb'>
          <Link href={getLocalizedPath(`/${lang}`,lang)}>
            <MainSVG /> Главная
          </Link>
          <Link href={getLocalizedPath(`/${lang}/admin`,lang)}>
            <NextSVG /> Администрирование
          </Link>
          <Link href={getLocalizedPath(`/${lang}/admin/${url}`,lang)}>
            <NextSVG /> {name}
          </Link>
        </div>
        <h1>{name}</h1>
      </div>
    </div>
  )
}

export default AdminHeader
