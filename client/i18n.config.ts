export const i18n = {
  defaultLocale: 'ua',
  locales: ['ru', 'ua'],
  localeDetection: false,
} as const;

export type Locale = (typeof i18n)['locales'][number];
