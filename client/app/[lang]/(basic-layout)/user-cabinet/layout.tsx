import { Locale } from '@/i18n.config';
import '@/app/[lang]/(basic-layout)/App.scss';
import './userCabinet.scss';
import { getDictionary } from '@/lib/dictionary';
import { ReactNode } from 'react';
import LeftPanel from './LeftPanel';
import ScrollToTop from './ScrollToTop';

export async function generateMetadata() {
  return {
    title: 'Особистий кабінет — Baylap',
    robots: 'noindex, nofollow',
  };
}

export default async function CabinetLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const { leftPanel } = await getDictionary(lang);
  return (
    <div className="cabinetLayout">
      <div className="cabinetLayout__wrapper">
        <LeftPanel dictionary={leftPanel} lang={lang} />

        <div className="cabinetLayout--contnet">{children}</div>
        <ScrollToTop />
      </div>
    </div>
  );
}
