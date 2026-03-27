'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
  loading: () => <p>Завантаження редактора...</p>,
});
import './JoditEditor.scss';
// Вам може знадобитися імпортувати стилі Jodit
//import 'jodit/build/jodit.min.css';

type Props = {
  placeholder: string;
  value: string;
  setValue: any;
  name: string;
};

const config = {
  readonly: false,
  toolbarButtonSize: 'large' as const,
  height: 400,
  buttons: 'bold,italic,underline,|,ul,ol,|,table,link,image,|,source',
  uploader: {
    url: `${process.env.NEXT_PUBLIC_API_SERVER}upload-image/`,
    format: 'json',
    filesVariableName: () => 'file',
    insertImageAsBase64URI: false,
    isSuccess: (resp: any) => resp.success === true,
    process: (resp: any) => {
      if (resp.success && resp.data?.files?.length) {
        // 👇 Jodit чекає просто масив URL'ів
        return {
          files: resp.data.files.map((f: any) => f.url),
          path: resp.data.files[0].url,
          baseurl: 'ItsPage',
        };
      }
      return [];
    },
    error: (e: any) => {
      console.error('❌ Upload error:', e);
    },
  },
  allowDragAndDropFileToEditor: true,
};

const MyJoditEditor = ({ value, placeholder, setValue, name }: Props) => {
  // Jodit використовує посилання для доступу до екземпляра редактора
  const editor = React.useRef(null);

  useEffect(() => {
    if (!value) return;

    // шукає <a href="ItsPage/image/...">ItsPage/image/...</a>
    const linkRegex = /<a\s+href="ItsPage(\/image\/[^"]+)">ItsPage\1<\/a>/gi;

    if (linkRegex.test(value)) {
      const newValue = value.replace(linkRegex, (_, url) => {
        return `<p><img src="${url}" alt="" width="300"><br></p>`;
      });

      if (newValue !== value) {
        setValue(newValue, name);
      }
    }
  }, [value, name, setValue]);

  return (
    <div className="JoditEditor-container">
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        //onBlur={(newContent) => setValue(newContent, name)} // Обробляємо зміни при втраті фокусу
        onChange={(newContent) => setValue(newContent, name)} // Або використовуйте onChange, якщо потрібно відстежувати зміни в реальному часі
      />
    </div>
  );
};

export default MyJoditEditor;
