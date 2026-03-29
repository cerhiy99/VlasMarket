import { Locale } from '@/i18n.config';

import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';

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
      <Header lang={lang} />
      <main>{children}</main>
      <footer>
        <Footer lang={lang} />
      </footer>
    </>
  );
}
