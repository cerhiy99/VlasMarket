import { Locale } from '@/i18n.config';
import './Delivery.scss';
import { getDictionary } from '@/lib/dictionary';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import DeliverySVG from '@/app/assest/DeliveryCookiesAndOther/Delivery.svg';
import NewPostSVG from '@/app/assest/DeliveryCookiesAndOther/NewPost.svg';
import UkrPostSVG from '@/app/assest/DeliveryCookiesAndOther/UkrPost.svg';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const urlPath = lang === 'ua' ? '' : '/ru';
  const canonicalUrl = `${baseUrl}${urlPath}/delivery`;

  // Локалізовані тексти
  const titles = {
    ua: 'Доставка — Baylap',
    ru: 'Доставка — Baylap',
  };

  const descriptions = {
    ua: 'Інформація про доставку замовлень в інтернет-магазині Baylap.',
    ru: 'Информация о доставке заказов в интернет-магазине Baylap.',
  };

  return {
    title: titles[lang] || titles.ua,
    description: descriptions[lang] || descriptions.ua,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `${baseUrl}/delivery`,
        uk: `${baseUrl}/delivery`,
        ru: `${baseUrl}/ru/delivery`,
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

const Page = async ({ params }: Props) => {
  const { lang } = await params;
  const { delivery } = await getDictionary(lang);
  return (
    <div className="delivery-container">
      <BreadCrumbs lang={lang} listUrles={[{ name: delivery.title, url: 'delivery' }]} />
      <div className="delivery-main">
        <div className="main-title">
          <DeliverySVG />
          <h1>{delivery.title}</h1>
        </div>
        <div className="block">
          <h2>
            <NewPostSVG />
          </h2>
          <p dangerouslySetInnerHTML={{ __html: delivery.description1 }} />
        </div>
        <div className="block">
          <h3>{delivery.miniTitle2}</h3>
          <ul>
            {delivery.ul1.map((x, idx) => (
              <li key={idx}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="block">
          <h3>{delivery.miniTitle3}</h3>
          <p dangerouslySetInnerHTML={{ __html: delivery.description3 }} />
        </div>
        <div className="block">
          <h3>{delivery.miniTitle4}</h3>
          <p dangerouslySetInnerHTML={{ __html: delivery.description4 }} />
        </div>
        <div className="block">
          <h3>{delivery.miniTitle5}</h3>
          <p dangerouslySetInnerHTML={{ __html: delivery.description5 }} />
        </div>
        <div className="block">
          <h3>{delivery.miniTitle6}</h3>
          <ul>
            {delivery.ul2.map((x, idx) => (
              <li key={idx}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="block">
          <h2>
            <UkrPostSVG />
          </h2>
          <p dangerouslySetInnerHTML={{ __html: delivery.description7 }} />
        </div>
        <div className="block">
          <h3>{delivery.miniTitle8}</h3>
          <p dangerouslySetInnerHTML={{ __html: delivery.description8 }} />
        </div>
        <div className="block">
          <h3>{delivery.titleMini9}</h3>
          <ul>
            {delivery.description9.map((x, idx) => (
              <li key={idx}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
