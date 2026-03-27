import { Locale } from '@/i18n.config';
import React from 'react';
import './SelectGoods.scss';
import GoodsBreadCumbs from '@/app/components/SelectGoods/GoodsBreadCumbs';
import { getDictionary } from '@/lib/dictionary';
import CardWithImg from '@/app/components/SelectGoods/CardWithImg';
import { notFound } from 'next/navigation';
import { UkrToEng } from '@/app/components/utils/UkrToEng';

type Props = {
  params: { lang: Locale; id: string };
  searchParams: any;
};
const getData = async (id: string, lang: Locale) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}goods/getForVolumeId/${id}?lang=${lang}`,
      { cache: 'no-cache' }
    );

    if (!res.ok) {
      return notFound();
    }

    const data = await res.json();

    const { good, reviews, indexVolume } = data;
    const watchMore = data.watchMore.map((x: any) => ({
      id: x.id,
      [`name${lang == 'ru' ? 'ru' : 'uk'}`]: x[`name${lang == 'ru' ? 'ru' : 'uk'}`],
      art: x.art,
      [`characteristic${lang == 'ru' ? 'ru' : 'uk'}`]:
        x[`characteristic${lang == 'ru' ? 'ru' : 'uk'}`],
      isDiscount: x.isDiscount,
      isBestseller: x.isBestseller,
      isNovetly: x.isNovetly,
      isHit: x.isHit,
      isFreeDelivery: x.isFreeDelivery,
      nameTypeuk: x.nameTypeuk,
      nameTyperu: x.nameTyperu,
      volumes: x.volumes.map((j: any) => ({
        id: j.id,
        nameVolume: j.nameVolume,
        volume: j.volume,
        price: j.price,
        discount: j.discount,
        priceWithDiscount: j.priceWithDiscount,
        isAvailability: j.isAvailability,
        url: j.url,
        isFreeDelivery: j.isFreeDelivery,
        art: j.art,
        imgs: j.imgs,
      })),
    }));
    return { good, reviews, indexVolume, watchMore }; // Повертаємо розпарсені дані (товари)
  } catch (err) {
    console.error('Fetch error:', err);
    return notFound();
  }
};

const SelectGoods = async ({ params: { lang, id }, searchParams }: Props) => {
  const { SelectGoods } = await getDictionary(lang);
  const { good: selectGoods, indexVolume, watchMore, reviews } = await getData(id, lang);

  // Важливо: перевіряємо, чи отримали ми товар. Якщо ні, повертаємо notFound().
  if (!selectGoods) {
    return notFound();
  }

  // Логіка для хлібних крихт
  const listUrlBread = [{ url: `/${lang}/goods/1`, name: 'Каталог' }];
  if (selectGoods.category) {
    listUrlBread.push({
      url: `/${lang}/goods/${UkrToEng(selectGoods.category.nameru)}/1`,
      name: lang === 'ru' ? selectGoods.category.nameru : selectGoods.category.nameuk,
    });
  }
  if (
    selectGoods.subcategory &&
    selectGoods.subcategory != null &&
    selectGoods.subcategory.nameuk
  ) {
    listUrlBread.push({
      url: `/${lang}/goods/${UkrToEng(selectGoods.category.nameru)}/${UkrToEng(selectGoods.subcategory.nameru)}/1`,
      name: lang === 'ru' ? selectGoods.subcategory.nameru : selectGoods.subcategory.nameuk,
    });
  }
  listUrlBread.push({
    url: `/${lang}/goods/${id}`,
    name: lang === 'ru' ? selectGoods.nameru : selectGoods.nameuk,
  });

  const selectVolumeId = selectGoods.volumes.find((x: any) => x.url == id).id;

  // !!! Ось тут починається новий блок коду для Schema.org
  const volume = selectGoods.volumes[indexVolume] || selectGoods.volumes[0];

  const title = lang === 'ru' ? selectGoods.nameru : selectGoods.nameuk;
  const rawDescription = lang === 'ru' ? selectGoods.descriptionru : selectGoods.descriptionuk;
  const plainDescription = rawDescription.replace(/<[^>]+>/g, '').slice(0, 200);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const canonicalUrl = `${baseUrl}/${lang === 'ru' ? 'ru/' : ''}goods/${id}`;
  const imageUrl = volume.imgs?.[0]?.img
    ? `${process.env.NEXT_PUBLIC_SERVER}${volume.imgs[0].img}`
    : '';
  const sku = selectGoods.art || '';
  const brandName = selectGoods.brend?.name || '';
  const categoryName = lang === 'ru' ? selectGoods.category.nameru : selectGoods.category.nameuk;
  const price = volume.priceWithDiscount?.toString() || '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product', // Можна прибрати @graph, якщо об'єкт один — так простіше для валідатора
    name: title,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    description: plainDescription,
    url: canonicalUrl,
    sku: sku,
    // Google рекомендує передавати масив рядків для зображень
    image: [imageUrl],
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'UAH',
      url: canonicalUrl,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        volume.isAvailability === 'inStock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      // Додаємо дату, до якої ціна актуальна (наприклад, +1 рік від сьогодні)
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
      shippingDetails: {
        // Google тепер звертає на це увагу для Merchant Center
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'UA',
        },
      },
      hasMerchantReturnPolicy: {
        // Теж корисно для відображення ціни в пошуку
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'UA',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        feesCollector: 'https://schema.org/ReturnFeesCustomerPay',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="select-goods-container">
        {/* Додаємо JSON-LD скрипт тут */}
        <GoodsBreadCumbs listUrl={listUrlBread} lang={lang} />
        <h1>{lang === 'ru' ? selectGoods.nameru : selectGoods.nameuk}</h1>
        <CardWithImg
          lang={lang}
          selectGoods={selectGoods}
          dictionary={SelectGoods}
          defaultIndexVolume={indexVolume}
          selectVolumeId={selectVolumeId}
          watchMore={watchMore}
          reviews={reviews}
          searchParams={searchParams}
        />
      </div>
    </>
  );
};

export default SelectGoods;
