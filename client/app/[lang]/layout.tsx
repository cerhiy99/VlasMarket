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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1Q6M8TTHC2"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-1Q6M8TTHC2');
      `}
        </Script>
      </head>

      <body>
        <TranslationProvider lang={lang}>
          <Providers>{children}</Providers>
        </TranslationProvider>
      </body>
    </html>
  );
}
