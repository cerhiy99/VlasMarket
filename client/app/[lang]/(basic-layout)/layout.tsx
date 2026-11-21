import { Locale } from '@/i18n.config';

//import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import Header from '@/app/components/Header/Header';
import Script from 'next/script';
import Providers from '@/app/store/providers';
import { TranslationProvider } from '@/context/TranslationProvider';

type Params = Promise<{ lang: Locale }>;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params; // Тепер це чистий Promise
}) {
  const { lang } = await params;
  return (
    <>
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
      <Header lang={lang} />
      <body>
        <TranslationProvider lang={lang}>
          <Providers>
            <main>{children}</main>
          </Providers>
        </TranslationProvider>
      </body>
      <footer>
        <Footer lang={lang} />
      </footer>
    </>
  );
}
