import { Locale } from '@/i18n.config';
import React from 'react';
import './SelectBlog.scss';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import MiniBlog from '@/app/components/Blog/MiniBlog';
import { Metadata } from 'next';
import IsAdmin from '@/app/components/utils/IsAdmin';
import Link from 'next/link';
import DelBlog from '@/app/components/Blog/DelBlog';

type Props = {
  params: {
    lang: Locale;
    url: string;
  };
};

const getData = async (url: string) => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_SERVER + `blog/getOne/${url}`,
      { cache: 'no-store' },
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, url } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Отримуємо блог
  const { blog } = await getData(url);
  if (!blog) return notFound();

  // Title та description з урахуванням мови
  const title = lang === 'ru' ? blog.nameru : blog.nameuk;

  const rawDescription =
    lang === 'ru' ? blog.descriptionru : blog.descriptionuk;

  // Відчищаємо HTML та обрізаємо до 200 символів
  const plainDescription = rawDescription.replace(/<[^>]+>/g, '').slice(0, 200);

  // Формуємо URL
  const canonicalUrl = `${baseUrl}/${lang === 'ru' ? 'ru/' : ''}blog/${blog.url}`;

  // Зображення
  const imageUrl = blog.img
    ? `${process.env.NEXT_PUBLIC_SERVER}${blog.img}`
    : '';

  return {
    title,
    description: plainDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `${baseUrl}/select-blog/${blog.url}`,
        uk: `${baseUrl}/select-blog/${blog.url}`,
        ru: `${baseUrl}/ru/select-blog/${blog.url}`,
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
}

const SelectBlog = async ({ params: { lang, url } }: Props) => {
  const { blog, otherBlog } = await getData(url);

  if (blog == null) return notFound();

  return (
    <div className="select-blog-container">
      <BreadCrumbs
        lang={lang}
        listUrles={[
          { name: 'Блог', url: getLocalizedPath(`/${lang}/blog/1`, lang) },
          { name: lang == 'ru' ? blog.nameru : blog.nameuk, url: '' },
        ]}
      />
      <div className="select-blog">
        <div className="blog">
          <h1>{lang == 'ru' ? blog.nameru : blog.nameuk}</h1>
          <div className="date">{blog.createdAt.slice(0, 10)}</div>
          <div className="img-container">
            <Image
              src={process.env.NEXT_PUBLIC_SERVER + blog.img}
              width={1920}
              height={1080}
              alt={lang == 'ru' ? blog.nameru : blog.nameuk}
              priority
              fetchPriority="high"
            />
          </div>
          <DelBlog id={blog.id} />

          <IsAdmin>
            <Link
              href={getLocalizedPath(`/${lang}/admin/blog/update/${url}`, lang)}
            >
              <button
                style={{
                  backgroundColor: 'blue',
                  border: 'none',
                  color: '#fff',
                  padding: '5px',
                  marginTop: '10px',
                  cursor: 'pointer',
                }}
              >
                Редактировать
              </button>
            </Link>
          </IsAdmin>
          <div
            className="description"
            dangerouslySetInnerHTML={{
              __html: lang == 'ru' ? blog.descriptionru : blog.descriptionuk,
            }}
          />
        </div>
        <div className="other-blog">
          <p className="read-more">
            {lang == 'ru' ? 'Читайте також' : 'Читайте также'}
          </p>
          <div className="list-blog">
            {otherBlog.map((x: any) => (
              <MiniBlog key={x.id} is100Procent blog={x} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectBlog;
