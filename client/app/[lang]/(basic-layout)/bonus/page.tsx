import { Locale } from '@/i18n.config';
import React from 'react';
import './Bonus.scss';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import { getDictionary } from '@/lib/dictionary';

type Props = {
  params: Promise<{ lang: Locale }>;
};

type BonusCard = {
  title: string;
  subtitle?: string;
  text?: string;
};

type BonusDictionary = {
  title: string;
  heroTitle: string;
  heroDescription: string;
  heroRate: string;
  heroNote: string;
  cards: {
    accrual: BonusCard;
    activation: BonusCard;
    noAccrual: BonusCard;
    cancel: BonusCard;
    return: BonusCard;
    term: BonusCard;
  };
};

const Page = async ({ params }: Props) => {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const bonus = dictionary.bonus as BonusDictionary;

  const cards = [
    {
      key: 'accrual',
      data: bonus.cards.accrual,
      icon: '/images/bonus/bonus-1.svg',
    },
    {
      key: 'activation',
      data: bonus.cards.activation,
      icon: '/images/bonus/bonus-2.svg',
    },
    {
      key: 'noAccrual',
      data: bonus.cards.noAccrual,
      icon: '/images/bonus/bonus-3.svg',
    },
    {
      key: 'cancel',
      data: bonus.cards.cancel,
      icon: '/images/bonus/bonus-4.svg',
    },
    {
      key: 'return',
      data: bonus.cards.return,
      icon: '/images/bonus/bonus-5.svg',
    },
    {
      key: 'term',
      data: bonus.cards.term,
      icon: '/images/bonus/bonus-6.svg',
    },
  ];

  return (
    <div className="bonus-page">
      <div className="bonus-page__inner">
        <BreadCrumbs
          lang={lang}
          listUrles={[{ url: 'bonus', name: bonus.title }]}
        />

        <h1 className="bonus-page__title">{bonus.title}</h1>

        <section className="bonus-hero">
          <div className="bonus-hero__content">
            <h2 className="bonus-hero__title">{bonus.heroTitle}</h2>

            <p className="bonus-hero__description">{bonus.heroDescription}</p>

            <div className="bonus-hero__info">
              <p className="bonus-hero__rate">{bonus.heroRate}</p>
              <p className="bonus-hero__note">{bonus.heroNote}</p>
            </div>
          </div>

          <div className="bonus-hero__image">
            <img src="/images/bonus/bonus-main.svg" alt={bonus.heroTitle} />
          </div>
        </section>

        <section className="bonus-grid">
          {cards.map((card) => {
            const hasSubtitle = card.data.subtitle?.trim();
            const hasText = card.data.text?.trim();

            return (
              <article className="bonus-card" key={card.key}>
                <div className="bonus-card__icon">
                  <img src={card.icon} alt={card.data.title} />
                </div>

                <div className="bonus-card__content">
                  <h3 className="bonus-card__title">{card.data.title}</h3>

                  {hasSubtitle && (
                    <p className="bonus-card__subtitle">{card.data.subtitle}</p>
                  )}

                  {hasText && (
                    <p className="bonus-card__text">{card.data.text}</p>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Page;