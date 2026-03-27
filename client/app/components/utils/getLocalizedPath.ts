import { Locale } from '@/i18n.config';

export function getLocalizedPath(path: string, lang: Locale | undefined): string {
  path = path.replaceAll('undefined', 'ru');
  if (lang != 'ru' && lang != 'ua') {
    lang = 'ru';
  }
  // Видаляємо можливий префікс мови з початку шляху,
  // щоб уникнути дублювання, наприклад, /ru/ru/blog.
  let cleanedPath = path.startsWith('/ua') || path.startsWith('/ru') ? path.substring(3) : path;

  // Видаляємо скісну риску на початку, якщо вона є,
  // для коректного з'єднання.
  if (cleanedPath.startsWith('/')) {
    cleanedPath = cleanedPath.substring(1);
  }

  // Якщо поточна мова — українська, повертаємо шлях без префікса.
  if (lang === 'ua') {
    return `/${cleanedPath}`;
  }

  // Для інших мов, додаємо префікс.
  let res = `/${lang}/${cleanedPath}`.replaceAll('//', '/');
  if (res.endsWith('/')) {
    res = res.slice(0, res.length - 1);
  }
  if (res == '/' || res == '') {
    res = '/';
  }

  return res;
}
