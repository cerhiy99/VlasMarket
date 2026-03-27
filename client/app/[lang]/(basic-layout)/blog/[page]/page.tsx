import React from 'react';
import './BlogList.scss';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import { Locale } from '@/i18n.config';
import { notFound } from 'next/navigation';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import MiniBlog from '@/app/components/Blog/MiniBlog';
import { Metadata } from 'next';
import MyPagination from '@/app/components/MyPagination/MyPagination';
import SelectBlog from '../../select-blog/[url]/SelectBlog';

const LIMIT = 20;

const getBlog = async (url: string) => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_SERVER + `blog/getOne/${url}`, {
      cache: 'no-cache',
    });
    if (!res.ok) {
      return notFound();
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return notFound();
  }
};

type Props = {
  params: Promise<{ lang: Locale; page: string }>;
  searchParams: any;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, page } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (page.includes('-')) {
    // Отримуємо блог
    const url = page;
    const { blog } = await getBlog(url);
    if (!blog) return notFound();

    // Title та description з урахуванням мови
    const title = lang === 'ru' ? blog.nameru : blog.nameuk;

    const rawDescription = lang === 'ru' ? blog.descriptionru : blog.descriptionuk;

    // Відчищаємо HTML та обрізаємо до 200 символів
    const plainDescription = rawDescription.replace(/<[^>]+>/g, '').slice(0, 200);

    // Формуємо URL
    const canonicalUrl = `${baseUrl}/${lang === 'ru' ? 'ru/' : ''}blog/${blog.url}`;

    // Зображення
    const imageUrl = blog.img ? `${process.env.NEXT_PUBLIC_SERVER}${blog.img}` : '';

    return {
      title,
      description: plainDescription,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'x-default': `${baseUrl}/blog/${blog.url}`,
          uk: `${baseUrl}/blog/${blog.url}`,
          ru: `${baseUrl}/ru/blog/${blog.url}`,
        },
      },
      openGraph: {
        title,
        description: plainDescription,
        url: canonicalUrl,
        type: 'article',
        siteName: 'Baylap',
        images: imageUrl
          ? [
              {
                url: imageUrl,
                alt: title,
              },
            ]
          : [],
      },
    };
  } else {
    const urlPath = lang === 'ua' ? '' : '/ru';

    // канонічні та мовні URL
    const canonicalUrl = `${baseUrl}${urlPath}/blog/1`;
    const uaUrl = `${baseUrl}/blog/${page}`;
    const ruUrl = `${baseUrl}/ru/blog/${page}`;

    const titles = {
      ua: `Блог сторінка ${page} | Baylap`,
      ru: `Блог страница ${page} | Baylap`,
    };

    const descriptions = {
      ua: `Читайте статті нашого блогу. Сторінка ${page} інтернет-магазину Baylap.`,
      ru: `Читайте статьи нашего блога. Страница ${page} Интернет-магазина Baylap.`,
    };

    return {
      title: titles[lang] || titles.ua,
      description: descriptions[lang] || descriptions.ua,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'x-default': canonicalUrl,
          uk: uaUrl,
          ru: ruUrl,
        },
      },
      openGraph: {
        title: titles[lang] || titles.ua,
        description: descriptions[lang] || descriptions.ua,
        url: canonicalUrl,
        type: 'website',
        siteName: 'Baylap',
      },
    };
  }
}

const getData = async (page: number | string) => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_SERVER + `blog/get?page=${page}&limit=${LIMIT}`,
      { cache: 'no-store' }
    );
    if (!res.ok) {
      return notFound();
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return notFound();
  }
};

const page = async (props: Props) => {
  const { params, searchParams } = await props;
  const { page, lang } = await params;
  const isNumeric = /^[0-9]+$/.test(page);

  if (!isNumeric) {
    return <SelectBlog params={{ url: page, lang }} />;
  }

  const pageNumber = Number(page);
  const {
    blog,
    pagination: { limit, totalPages, totalItems },
  } = await getData(pageNumber);

  return (
    <div className="blog-container">
      <BreadCrumbs lang={lang} listUrles={[{ name: 'Блог', url: `/${lang}/blog` }]} />
      <h1>Блог</h1>
      <div className="blog-list">
        {blog.map((x: any) => (
          <MiniBlog key={x.id} blog={x} lang={lang} />
        ))}
      </div>
      {totalPages > 1 ? (
        <MyPagination
          currentPathname={getLocalizedPath(`/${lang}/blog`, lang)}
          currentSearchParams={''}
          lang={lang}
          currentPage={pageNumber}
          totalPages={totalPages}
        />
      ) : (
        <>
          <br />
          <br />
          <br />
        </>
      )}
    </div>
  );
};

export default page;
