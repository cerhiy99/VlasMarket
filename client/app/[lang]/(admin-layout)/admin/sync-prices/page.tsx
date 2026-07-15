'use client';

import React, { useEffect, useState } from 'react';
import './SyncPrices.scss';
import { $authHost } from '@/app/http';

type BrendType = {
  id: number;
  name: string;
};

const Page = () => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url && !file) {
      return alert('Вкажіть посилання або виберіть файл');
    }

    const formData = new FormData();

    if (url) {
      formData.append('url', url);
    }

    if (file) {
      formData.append('file', file);
    }

    try {
      setLoading(true);

      const res = await $authHost.post('sync-prices/', formData);
      console.log(res);
      alert('Успішно синхронізовано');
      setUrl('');
      setFile(null);
    } catch {
      alert('Помилка синхронізації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sync-prices-container">
      <h1>Синхронізація цін</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Посилання</label>

          <input
            type="url"
            placeholder="https://example.com/file.xml"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="or">або</div>

        <div className="field">
          <label>Файл</label>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Відправка...' : 'Синхронізувати'}
        </button>
      </form>
    </div>
  );
};

export default Page;
