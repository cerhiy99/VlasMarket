import './Cabinet.scss';
import MainImage from '@/app/assest/Cabinet/main.webp';
import { Locale } from '@/i18n.config';
import TabNavigation from './components/tabNavigation';
import { getDictionary } from '@/lib/dictionary';
import Image from 'next/image';

export default async function page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const { cabinetPage } = await getDictionary(lang);

  return (
    <div className="mainContent__wrapper">
      <div className="image__svg">
        <Image src={MainImage} alt="Головна картинка кабінета" />
      </div>
      <div className="mainContnent">
        <h2 className="mainContnent__title">{cabinetPage.title}</h2>
        <p className="mainContnent__text">{cabinetPage.text}</p>
      </div>
      <TabNavigation lang={lang} />
    </div>
  );
}
