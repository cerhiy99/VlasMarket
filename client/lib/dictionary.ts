import 'server-only';
import type { Locale } from '@/i18n.config';

const dictionaries = {
  ua: () => import('@/dictionaries/ua.json').then((module) => module.default),
  ru: () => import('@/dictionaries/ru.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  // 1. Якщо locale undefined або порожня, відразу віддаємо дефолтну мову
  if (!locale) {
    return dictionaries.ua();
  }

  // 2. Очищаємо локаль від можливих зайвих символів (наприклад, "ru/" -> "ru")
  const cleanLocale = (
    typeof locale === 'string' ? locale.replace('/', '') : locale
  ) as keyof typeof dictionaries;

  const loadDictionary = dictionaries[cleanLocale];

  if (typeof loadDictionary !== 'function') {
    console.error(`Dictionary for locale "${locale}" not found!`);
    // 3. Замість помилки повертаємо дефолтну мову
    return dictionaries.ua();
  }

  return loadDictionary();
};
