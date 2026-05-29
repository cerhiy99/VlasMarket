import Script from 'next/script';
import { Locale, i18n } from '@/i18n.config';
import Providers from '../store/providers';
import { TranslationProvider } from '@/context/TranslationProvider';
import { phones } from '../components/Footer/listSocialNetwork';

type Params = Promise<{ lang: Locale }>;

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata() {
  return {
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params; // Тепер це чистий Promise
}) {
  // 2. Очікуємо виконання Promise
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  return (
    <html lang={lang == 'ru' ? lang : 'uk'}>
      <head>
        {/*<link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700;800;900&display=swap"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E6NLPXJE38"
          strategy="lazyOnload"
        />

        <Script
          id="google-tags-init"
          
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-E6NLPXJE38');
      `,
          }}
        />*/}
      </head>
      <body>
        <TranslationProvider lang={lang}>
          <Providers>{children}</Providers>
        </TranslationProvider>
      </body>
    </html>
  );
}
