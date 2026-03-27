import { Locale } from '@/i18n.config';
import '../delivery/Delivery.scss';
import { getDictionary } from '@/lib/dictionary';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import img1 from '@/app/assest/how-to-place-order/image.png';
import img2 from '@/app/assest/how-to-place-order/image2.png';
import img3 from '@/app/assest/how-to-place-order/image3.png';
import Image from 'next/image';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const urlPath = lang === 'ua' ? '' : '/ru';
  const canonicalUrl = `${baseUrl}${urlPath}/how-place-order`;

  const titles = {
    ua: 'Як оформити замовлення — Baylap',
    ru: 'Как оформить заказ — Baylap',
  };

  const descriptions = {
    ua: 'Інструкція про те, як оформити замовлення в інтернет-магазині Baylap.',
    ru: 'Инструкция о том, как оформить заказ в интернет-магазине Baylap.',
  };

  return {
    title: titles[lang] || titles.ua,
    description: descriptions[lang] || descriptions.ua,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `${baseUrl}/how-place-order`,
        uk: `${baseUrl}/how-place-order`,
        ru: `${baseUrl}/ru/how-place-order`,
      },
    },
    openGraph: {
      title: titles[lang] || titles.ua,
      description: descriptions[lang] || descriptions.ua,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Baylap',
    },
  };
}

const Page = async ({ params: { lang } }: Props) => {
  const { howPlaceOrder } = await getDictionary(lang);
  return (
    <div className="delivery-container">
      <BreadCrumbs
        lang={lang}
        listUrles={[{ name: howPlaceOrder.title, url: 'offer-agreement' }]}
      />
      <div className="delivery-main">
        <div className="main-title">
          <h1>{howPlaceOrder.title}</h1>
        </div>
        <div className="block">
          <p>{howPlaceOrder.miniTitle}</p>
          <ul>
            <li>{howPlaceOrder.li1}</li>
            <li>{howPlaceOrder.li2}</li>
            <li>
              {howPlaceOrder.li3}
              <ul>
                <li>{howPlaceOrder.li4}</li>

                <br />
                <Image
                  style={{ maxWidth: '100%', height: 'auto' }}
                  src={img1}
                  alt="Как сделать заказ"
                />
                <br />
                <li>{howPlaceOrder.li5}</li>

                <br />
                <Image
                  style={{ maxWidth: '100%', height: 'auto' }}
                  src={img2}
                  alt="Как сделать заказ"
                />
                <br />
                <li>{howPlaceOrder.li6}</li>
                <li>{howPlaceOrder.li7}</li>
                <li>{howPlaceOrder.li8}</li>
                <br />
                <Image
                  style={{ maxWidth: '100%', height: 'auto' }}
                  src={img3}
                  alt="Как сделать заказ"
                />
                <br />
                <li>{howPlaceOrder.li9}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
