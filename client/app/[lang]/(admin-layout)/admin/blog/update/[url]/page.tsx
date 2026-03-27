'use client';
import React, { use, useEffect, useState } from 'react';
import UpdateBlog from '../UpdateBlog';
import { $authHost } from '@/app/http';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import { Locale } from '@/i18n.config';
import './UpdateBlog.scss';

type Props = {
  params: Promise<{ url: string; lang: Locale }>;
};

const Page = ({ params }: Props) => {
  const { url, lang } = use(params);
  const router = useRouter();
  const [listBlog, setListBlog] = useState([]);
  const getListBlog = async () => {
    try {
      const res = await $authHost.get(`blog/get?limit=${99999}`);
      setListBlog(res.data.blog);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getListBlog();
  }, []);
  return (
    <div>
      <div className="list-blog-admin-container">
        <h1>Список статей</h1>
        <select
          value={url}
          onChange={(e) => {
            router.push(getLocalizedPath(`/${lang}/admin/blog/update/${e.target.value}`, lang));
          }}
        >
          <option value="selectBlog">Виберіть блог</option>
          {listBlog.map((x: any) => (
            <option value={x.url} key={x.id}>
              {x.nameuk}
            </option>
          ))}
        </select>
      </div>
      {url != 'selectBlog' && <UpdateBlog lang={lang} url={url} />}
    </div>
  );
};

export default Page;
