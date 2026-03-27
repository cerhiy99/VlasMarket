import React from 'react'
import './Goods.scss'
import { getDictionary } from '@/lib/dictionary'
import BreadCrumbs from '@/app/components/utils/BreadCrumbs'
import Sort from '@/app/components/goods/Sort/Sort'
import { GoodInterface } from '@/app/interfaces/goods'
import ListGoods from '@/app/components/goods/ListGoods'
import dynamic from 'next/dynamic'
import MyPagination from '@/app/components/MyPagination/MyPagination'
import { Locale } from '@/i18n.config' // Імпортуємо Locale
import { fromSlug } from '@/app/components/utils/addittional'
import { Metadata } from 'next'
import MyPagination2 from '@/app/components/MyPagination/MyPagination2'

type Props = {
  params: { lang: Locale; brend: string;}
  searchParams: { [key: string]: string | string[] | undefined } // Типізація для searchParams
}

export async function generateMetadata({
  params,
  searchParams
}: Props): Promise<Metadata> {
  const { miniGoods } = await getDictionary(params.lang)

  // Перетворюємо searchParams в URLSearchParams для зручності
  const currentSearchParams = new URLSearchParams()
  for (const key in searchParams) {
    const value = searchParams[key]
    if (Array.isArray(value)) {
      value.forEach(v => currentSearchParams.append(key, v))
    } else if (value !== undefined) {
      currentSearchParams.set(key, value)
    }
  }

  const {
    goods: data,
    totalGoods,
    totalPages,
    filters,
    realNameBrend
  }: {
    goods: GoodInterface[]
    totalGoods: number
    totalPages: number
    filters: any
    realNameBrend: string
  } = await getData(searchParams.PAGEN_1 as string|undefined||'1', limit, currentSearchParams, params.brend)

  const { lang, brend } = params
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const urlPath = lang === 'ua' ? '' : '/ru'

  // Створюємо рядок параметрів, якщо вони існують
  const searchParamsString = currentSearchParams.toString()
  const queryString = searchParamsString ? `?${searchParamsString}` : ''

  // Формуємо повну канонічну URL з параметрами
  const canonicalUrl = `${baseUrl}${urlPath}/brands/${brend}${queryString}`
  const uaUrl = `${baseUrl}/brands/${brend}${queryString}`
  const ruUrl = `${baseUrl}/ru/brands/${brend}${queryString}`

  // Локалізовані тексти
  const titles = {
    ua: `${realNameBrend} — сторінка ${searchParams.PAGEN_1||1} | Baylap`,
    ru: `${realNameBrend} — страница ${searchParams.PAGEN_1||1} | Baylap`
  }

  const descriptions = {
    ua: `Перегляньте товари бренду ${realNameBrend} — сторінка ${searchParams.PAGEN_1||1} в інтернет-магазині Baylap.`,
    ru: `Посмотрите товары бренда ${realNameBrend} — страница ${searchParams.PAGEN_1||1} в интернет-магазине Baylap.`
  }

  return {
    title: titles[lang] || titles.ua,
    description: descriptions[lang] || descriptions.ua,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': uaUrl,
        uk: uaUrl,
        ru: ruUrl
      }
    },
    openGraph: {
      title: titles[lang] || titles.ua,
      description: descriptions[lang] || descriptions.ua,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Baylap'
    }
  }
}

const Filters = dynamic(
  () => import('@/app/components/goods/Filters/Filters'),
  { ssr: false }
)

const limit = 20

// Оновлена функція getData для прийому searchParams
const getData = async (
  page: string,
  limit: number = 15,
  searchParams: URLSearchParams,
  brendName: string
) => {
  try {
    // Формуємо рядок запиту з searchParams
    const queryParams = new URLSearchParams(searchParams)
    queryParams.set('page', page) // Встановлюємо поточну сторінку
    queryParams.set('limit', limit.toString()) // Встановлюємо ліміт

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}goods/get?brendName=${brendName}&${queryParams.toString()}`
    )

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.error('Fetch error:', err)
    return { goods: [], totalGoods: 0, totalPages: 0, filters: {} } // Повертаємо порожні дані у випадку помилки
  }
}

const Page = async ({
  params,
  searchParams
}: {
  params: { page: string; lang: Locale; brend: string } // Змінено page: Locale на page: string
  searchParams: { [key: string]: string | string[] | undefined } // Типізація для searchParams
}) => {
  const { miniGoods } = await getDictionary(params.lang)

  // Перетворюємо searchParams в URLSearchParams для зручності
  const currentSearchParams = new URLSearchParams()
  for (const key in searchParams) {
    const value = searchParams[key]
    if (Array.isArray(value)) {
      value.forEach(v => currentSearchParams.append(key, v))
    } else if (value !== undefined) {
      currentSearchParams.set(key, value)
    }
  }

  const {
    goods: data,
    totalGoods,
    totalPages,
    filters,
    realNameBrend
  }: {
    goods: GoodInterface[]
    totalGoods: number
    totalPages: number
    filters: any
    realNameBrend: string
  } = await getData(params.page, limit, currentSearchParams, params.brend) // Передаємо currentSearchParams


  
  return (
    <div className='goods-container'>
      <BreadCrumbs
        lang={params.lang}
        listUrles={[
          { name: 'бренди', url: `brands` },
          {
            name: realNameBrend,
            url: `brands/${params.brend}/1`
          }
        ]}
      />
      <div className='goods-main'>
        {/* Передаємо фільтри, отримані з бекенду, та поточні searchParams */}
        <Filters
          filters={filters}
          lang={params.lang}
          currentSearchParams={currentSearchParams}
          noBrands
          brand={params.brend}
        />
        <div className='sore-and-goods'>
          <h1>{realNameBrend}</h1>
          <Sort lang={params.lang} />
          <br />
          <ListGoods
            data={data}
            isFilter={true}
            lang={params.lang}
            dictionary={miniGoods}
          />
          {totalPages > 1 && (
            <MyPagination2
              totalPages={totalPages}
              currentPage={parseInt(params.page)}
              currentPathname={`/${params.lang}/brands/${params.brend}`}
              currentSearchParams={currentSearchParams} // Передаємо очищені searchParams
              lang={params.lang}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
