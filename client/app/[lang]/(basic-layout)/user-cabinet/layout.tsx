import { Locale } from '@/i18n.config';
import '@/app/[lang]/(basic-layout)/App.scss';
import './userCabinet.scss';
import { getDictionary } from '@/lib/dictionary';
import ListGoodsLeft from '@/app/components/Home/ListGoodsLeft';
import { ReactNode } from 'react';
import Image from 'next/image';
import UserDashboard from './components/userDashboard';
import UserWatched from '@/app/components/utils/UserWatched';
import LeftPanel from './LeftPanel';

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
      </div>
      {/*<div className="home-goods">
        <UserWatched
          title={home.youWatching}
          lang={lang}
          dictionary={miniGoods}
          type=""
        />
      </div>*/}
    </div>
  );
}
