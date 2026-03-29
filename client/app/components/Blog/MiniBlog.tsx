// components/MiniBlog.tsx
import { Locale } from '@/i18n.config';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import './MiniBlog.scss';

type Props = {
  blog: any;
  lang: Locale;
  is100Procent?: true;
};

const clearHTML = (description: string) => {
  if (!description) return '';

  // Видаляємо всі HTML-теги
  return description.replace(/<[^>]*>/g, '').trim();
};

const MiniBlog = ({ blog, lang, is100Procent }: Props) => {
  return (
    <Link
      href={getLocalizedPath(`/${lang}/blog/${blog.url}`, lang)}
      className={`mini-blog ${is100Procent ? 'is100procent' : ''}`}
    >
      {/* Щоб fill працював коректно, потрібно обгорнути Image у батьківський елемент
        з position: relative та заданою висотою або aspect-ratio.
      */}
      <div className="image-wrapper">
        <Image
          src={process.env.NEXT_PUBLIC_SERVER + blog.img}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"
          alt={lang == 'ru' ? blog.nameru : blog.nameuk}
          priority
        />
      </div>
      <div className="text">
        {' '}
        <div className="date">{blog.createdAt.slice(0, 10)}</div>
        <h2 className="mini-blog-title">
          {lang == 'ru' ? blog.nameru : blog.nameuk}
        </h2>
        <div
          className="description"
          dangerouslySetInnerHTML={{
            __html: clearHTML(
              lang == 'ru' ? blog.descriptionru : blog.descriptionuk
            ),
          }}
        />
      </div>
    </Link>
  );
};

export default MiniBlog;
