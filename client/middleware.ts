import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/i18n.config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locales = i18n.locales;
  const url = request.nextUrl.clone();

  // 1. СТРАХОВКА ВІД undefined
  // Якщо в шляху проскочило слово 'undefined', міняємо його на 'ru' і редиректимо
  if (pathname.includes('undefined')) {
    url.pathname = pathname.replaceAll('undefined', 'ru');
    return NextResponse.redirect(url, 301);
  }

  // 2. СТАТИКА ТА СИСТЕМНІ ШЛЯХИ
  // Пропускаємо відразу, щоб не навантажувати логіку
  if (
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/dictionaries')
  ) {
    return NextResponse.next();
  }

  // 3. СПЕЦІАЛЬНА ОБРОБКА КОРЕНЯ (Людмила хоче канонічний домен/)
  // Якщо запит прийшов як "domain.com" (без слеша в кінці), робимо редирект на "domain.com/"
  if (pathname === '/' && !request.url.endsWith('/')) {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }

  // Якщо ми вже на "/", робимо тихий rewrite на дефолтну локаль
  if (pathname === '/') {
    url.pathname = `/${i18n.defaultLocale}`;
    return NextResponse.rewrite(url);
  }

  // 4. ПРИХОВУЄМО /ua З URL
  // Якщо користувач заходить на домен/ua або домен/ua/ — кидаємо на чистий корінь /
  if (pathname === `/${i18n.defaultLocale}` || pathname === `/${i18n.defaultLocale}/`) {
    url.pathname = '/';
    return NextResponse.redirect(url, 301);
  }

  // 5. НОРМАЛІЗАЦІЯ СЛЕШІВ ДЛЯ ВНУТРІШНІХ СТОРІНОК (about-us/ -> about-us)
  // Перевіряємо, щоб це не був корінь іншої локалі (наприклад /en/)
  const isLocaleRoot = locales.some((loc) => pathname === `/${loc}/` || pathname === `/${loc}`);

  if (pathname.endsWith('/') && !isLocaleRoot && pathname !== '/') {
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  // 6. ОБРОБКА ВНУТРІШНІХ ШЛЯХІВ БЕЗ ЛОКАЛІ (contacts -> /ua/contacts)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Ховаємо префікс /ua через rewrite, щоб в браузері шлях був чистим
    url.pathname = `/${i18n.defaultLocale}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
