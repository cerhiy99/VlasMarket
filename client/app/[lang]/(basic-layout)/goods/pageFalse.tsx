import React from 'react'
import './Goods.scss'
import { getDictionary } from '@/lib/dictionary'
import BreadCrumbs from '@/app/components/utils/BreadCrumbs'
import Sort from '@/app/components/goods/Sort/Sort'
import { GoodInterface } from '@/app/interfaces/goods'
import ListGoods from '@/app/components/goods/ListGoods'
import dynamic from 'next/dynamic'
//import MyPagination from '@/app/components/MyPagination/MyPagination'
import { Locale } from '@/i18n.config' // Імпортуємо Locale
import { notFound } from 'next/navigation'
import MyPagination2 from '@/app/components/MyPagination/MyPagination2'
//import GoodsPageHead from './DynamicMetategs'
import { Metadata } from 'next'
//import MyPagination from '@/app/components/MyPagination/MyPagination'

const Filters = dynamic(
  () => import('@/app/components/goods/Filters/Filters'),
  { ssr: false }
)

const limit = 20

interface Props {
  params: { lang: 'ua' | 'ru' }
  searchParams?: { page?: string }
}

export async function generateMetadata({
  params,
  searchParams
}: Props): Promise<Metadata> {
  const { lang } = params
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const urlPath = lang === 'ua' ? '' : '/ru'
  const pageNoValidate=searchParams?.page;
  const page=pageNoValidate?1:searchParams?.page;

  // Створюємо рядок параметрів, якщо вони існують
  const searchParamsString = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString()
  const queryString = searchParamsString ? `?${searchParamsString}` : ''

  const canonicalUrl = `${baseUrl}${urlPath}/goods/${page}${queryString}`
  const uaUrl = `${baseUrl}/goods${queryString}`
  const ruUrl = `${baseUrl}/ru/goods${queryString}`

  const titles = {
    ua: `Каталог товарів | Baylap`,
    ru: `Каталог товаров | Baylap`
  }

  const descriptions = {
    ua: `Перегляньте сторінку каталогу товарів інтернет-магазину Baylap.`,
    ru: `Посмотрите страницу каталога товаров интернет-магазина Baylap.`
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


// Оновлена функція getData для прийому searchParams
const getData = async (
  page:string|number,
  limit: number = 20,
  searchParams: URLSearchParams
) => {
  try {
    // Формуємо рядок запиту з searchParams
    const queryParams = new URLSearchParams(searchParams)
    queryParams.set('page', page.toString()) // Встановлюємо поточну сторінку
    queryParams.set('limit', limit.toString()) // Встановлюємо ліміт

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}goods/get?${queryParams.toString()}`,
      { cache: 'no-store' }
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
  params: {lang: Locale } // Змінено page: Locale на page: string
  searchParams: { [key: string]: string | string[] | undefined } // Типізація для searchParams
}) => {
  const { miniGoods } = await getDictionary(params.lang)
  let pageStr = searchParams.PAGEN_1;
  
  if(pageStr==undefined)pageStr='1';
  const page = Number(pageStr)
  if (isNaN(page)) return notFound()
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
    filters
  }: {
    goods: GoodInterface[]
    totalGoods: number
    totalPages: number
    filters: any
  } = await getData(page, limit, currentSearchParams) // Передаємо currentSearchParams

  return (
    <>
    {//<GoodsPageHead page={page} lang={params.lang}/>
    }<div className='goods-container'>
      <BreadCrumbs
        lang={params.lang}
        listUrles={[{ name: 'товари', url: `goods` }]}
      />
      <div className='goods-main'>
        {/* Передаємо фільтри, отримані з бекенду, та поточні searchParams */}
        <Filters
          filters={filters}
          lang={params.lang}
          currentSearchParams={currentSearchParams}
        />
        <div className='sore-and-goods'>
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
              currentPage={page}
              currentPathname={`/${params.lang}/goods`}
              currentSearchParams={currentSearchParams} // Передаємо очищені searchParams
              lang={params.lang}
            />
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default Page
