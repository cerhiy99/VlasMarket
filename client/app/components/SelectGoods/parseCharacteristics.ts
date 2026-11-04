
import * as cheerio from 'cheerio';
import { GoodInterface } from '@/app/interfaces/goods';

type Lang = 'ru' | 'ua';

export interface Characteristic {
  name: string;
  value: string;
}

export function parseCharacteristics(
  html: string,
  lang: Lang,
  selectGoods: GoodInterface
): Characteristic[] {
  const $ = cheerio.load(html || '');

  const characteristics: Characteristic[] = $('li')
    .map((_, li) => {
      const name = $(li).find('p').first().text().trim();
      const value = $(li).find('span').first().text().trim();

      return { name, value };
    })
    .get();

  characteristics.push({
    name: selectGoods[`nameType${lang === 'ru' ? 'ru' : 'uk'}`] + ':',
    value: selectGoods.volumes
      .map((x) => x.volume.split('||')[lang === 'ru' ? 1 : 0])
      .join(','),
  });

  const priorityOrder =
    lang === 'ru'
      ? [
          'Страна производ',
          'Производ',
          'Назначе',
          'Линия',
          'Пол',
        ]
      : [
          'Країна виробника',
          'Виробник',
          'Призначення',
          'Лінія',
          'Стать',
        ];

  characteristics.sort((a, b) => {
    const indexA = priorityOrder.findIndex((x) =>
      a.name.startsWith(x)
    );

    const indexB = priorityOrder.findIndex((x) =>
      b.name.startsWith(x)
    );

    if (indexA === -1 && indexB === -1) {
      return a.name.localeCompare(
        b.name,
        lang === 'ru' ? 'ru' : 'uk'
      );
    }

    if (indexA === -1) return -1;
    if (indexB === -1) return 1;

    return indexA - indexB;
  });

  return characteristics;
}
