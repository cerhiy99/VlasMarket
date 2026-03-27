/*import { Locale } from '@/i18n.config'
import { getDictionary } from '@/lib/dictionary'
import React from 'react'
import './Reviews.scss'
import GoogleSVG from '@/app/assest/Reviews/Google.svg'
import ClientRating from '@/app/components/Reviews/ClientRating'
import ListReviews from '@/app/components/Reviews/ListReviews'
import BreadCrumbs from '@/app/components/utils/BreadCrumbs'
import ReviewsSVG from '@/app/assest/Reviews/Reviews.svg'

const getData = async () => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_SERVER + `reviews/getAllReviews`,
    { next: { revalidate: 3600 * 24 } }
  )
  if (!res.ok) throw new Error('Не вдалося отримати дані')
  const data = await res.json()
  return data
}

const page = async ({ params: { lang } }: { params: { lang: Locale } }) => {
  //const { averageRating, reviews } = await getData()
  const averageRating = 4.8
  const reviews = [
    {
      author_name: 'Катерина Сираєва',
      author_url:
        'https://www.google.com/maps/contrib/112838595670080464904/reviews',
      language: 'en-US',
      original_language: 'uk',
      profile_photo_url:
        'https://lh3.googleusercontent.com/a-/ALV-UjUS83ryPzy8vYmH0OpajojevyfjBVNV6AFQI1MS-gRsquziNLVdNA=s128-c0x00000000-cc-rp-mo-ba2',
      rating: 5,
      relative_time_description: 'a month ago',
      text: 'Дуже задоволена онлайн-магазином!\nЗамовляла маску та шампунь Envie. Все швидко та оперативно: зателефонували, відправили.\nВ посилочку послали приємні подарунки: додаткову спрей-маску, пробнички маски та шампуню іншої серії того ж виробника, що я купила, жуйка "Love is") Окрім цього всього, ще й безкоштовна доставка! Буду замовляти ще!',
      time: 1730211268,
      translated: true
    },
    {
      author_name: 'Kate Ru',
      author_url:
        'https://www.google.com/maps/contrib/118399589293213983608/reviews',
      language: 'en-US',
      original_language: 'ru',
      profile_photo_url:
        'https://lh3.googleusercontent.com/a-/ALV-UjW0RyR6mKl0Ly0B48nZosXzcLvnIOPGBj70nE4IoW_v5fMAE2g=s128-c0x00000000-cc-rp-mo',
      rating: 5,
      relative_time_description: 'a month ago',
      text: 'Лучший магазин косметики! Только тут есть серия Lisap Ultimate, особенно маска для волос, которой нет просто нигде. Быстрая отправка, вежливые и честные сотрудники, адекватные цены. Больше спасибо, очень рекомендую',
      time: 1729798383,
      translated: true
    },
    {
      author_name: 'Оксана Харченко',
      author_url:
        'https://www.google.com/maps/contrib/108600990744861272295/reviews',
      language: 'en-US',
      original_language: 'uk',
      profile_photo_url:
        'https://lh3.googleusercontent.com/a/ACg8ocKElhMg1EAUQ8rJRRK50GlxUeLN3Ckct4UWtUKtOabo6ijQOA=s128-c0x00000000-cc-rp-mo',
      rating: 5,
      relative_time_description: '2 months ago',
      text: 'Замовляю вже не вперше в цьому магазині, консультанти завжди швидко відповідають, за потреби дають слушні поради. Радують ціни та асортимент продукції. Посилочки дуже швидко приходять. Окрема подяка за подаруночки та гарну упаковку. Однозначно раджу замовляти тут. Бажаю побільше покупців та скорішого Миру)',
      time: 1729445261,
      translated: true
    },
    {
      author_name: 'Оксана Скотарь',
      author_url:
        'https://www.google.com/maps/contrib/117111504538228046597/reviews',
      language: 'en-US',
      original_language: 'ru',
      profile_photo_url:
        'https://lh3.googleusercontent.com/a-/ALV-UjW8ilmvcQBUgt6qp-cjVPq7D5Jczk9Ar6tKvN9V_5SCROHuwm5Z=s128-c0x00000000-cc-rp-mo',
      rating: 5,
      relative_time_description: '3 months ago',
      text: 'Заказала в этом магазине себе шампунь и маску Cutrin находясь в Италии. Очень переживала за перевозку. Посылка к моей радости пришла за 8 дней. Я очень довольна! Большое спасибо за презент и пробнички. Буду обращаться к вам еще.Спасибо 👍👍👍',
      time: 1726584680,
      translated: true
    },
    {
      author_name: 'Elena Mozhaiskaya',
      author_url:
        'https://www.google.com/maps/contrib/106736538732855753652/reviews',
      language: 'en-US',
      original_language: 'ru',
      profile_photo_url:
        'https://lh3.googleusercontent.com/a/ACg8ocKqGBKO5JKur1AkLN1pmPcqreeWIpLbpnms0G8_NSA4eMm7qQ=s128-c0x00000000-cc-rp-mo',
      rating: 5,
      relative_time_description: '3 months ago',
      text: 'Мой любимый магазин теперь со мной даже вдалеке от дома. Переехав в Германию столкнулась со сложностью в приобретении привычного красителя и ухода. Обратилась к любимым менеджерам и через 6 дней уже мыла голову любимым уходом! Супер сервис!',
      time: 1726407546,
      translated: true
    }
  ]

  const { Reviews } = await getDictionary(lang)

  return (
    <div className='reviews-container'>
      <BreadCrumbs
        listUrles={[{ name: Reviews.title, url: 'reviews' }]}
        lang={lang}
      />
      <div className='title'>
        <ReviewsSVG />
        <h1>{Reviews.title}</h1>
      </div>
      <div className='reviews-list-and-header'>
        <div className='reviews-header'>
          <div className='rating-and-google'>
            <div className='svg'>
              <GoogleSVG />
              <span> {Reviews.reviews}</span>
            </div>
            <div className='rating'>
              <p style={{ marginBottom: '5px' }}>{averageRating}</p>
              <ClientRating
                name='half-rating-read'
                defaultValue={averageRating}
                precision={0.1}
                isReadOnly={true}
                size={12}
              />
              <div className='count'>({reviews.length})</div>
            </div>
          </div>
          <a
            href={
              'https://www.google.com.ua/maps/place/%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%BD%D0%B5%D1%82-%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD+Constant+Delight/@49.9981406,36.3242124,93m/data=!3m1!1e3!4m17!1m8!3m7!1s0x412709f826f64dc5:0x1801c5cb33dc3239!2z0L_RgNC-0YHQvy4g0K7QsdC40LvQtdC50L3Ri9C5LCA0NdCxLCDQpdCw0YDRjNC60L7Qsiwg0KXQsNGA0YzQutC-0LLRgdC60LDRjyDQvtCx0LvQsNGB0YLRjCwgNjEwMDA!3b1!8m2!3d49.998079!4d36.324224!16s%2Fg%2F11p5zjfw9h!3m7!1s0x4127095b05ed51b1:0x64ecb58c9f014bc6!8m2!3d49.9981064!4d36.3243358!9m1!1b1!16s%2Fg%2F11h2mq8rx5?hl=ru&entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D'
            }
            className='write-review'
          >
            {Reviews.button}
          </a>
        </div>
        <ListReviews dictionary={Reviews} listReviews={reviews} />
      </div>
    </div>
  )
}

export default page
*/
