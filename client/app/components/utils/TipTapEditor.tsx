// components/TipTapEditor.tsx
'use client'

import React, { useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link'; // Додано для підтримки посилань
import Image from '@tiptap/extension-image'; // Додано для підтримки зображень

// Стилі для редактора
const editorStyles = `
  .tiptap-editor-container {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    background-color: #fff;
    font-family: sans-serif;
    color: #333;
    min-height: 200px;
    position: relative;
    margin-top: 1rem;
  }
  .tiptap-toolbar {
    display: flex;
    flex-wrap: wrap; /* Додано, щоб кнопки переносилися на новий рядок */
    gap: 0.5rem;
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #f0f0f0;
  }
  .tiptap-toolbar button {
    background: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
  }
  .tiptap-toolbar button:hover {
    background-color: #ddd;
  }
  .tiptap-toolbar button.is-active {
    background-color: #ccc;
  }
  .tiptap-editor-content p {
    margin: 0;
  }
  .tiptap-editor-content .ProseMirror:focus {
    outline: none;
  }
`;

interface TipTapEditorProps {
  data: string;
  onChange: (data: string) => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ data, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      // Додаємо розширення для посилань.
      Link.configure({
        openOnClick: false,
      }),
      // Додаємо розширення для зображень.
      Image,
    ],
    content: data,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    // Додаємо цей параметр для вирішення помилки гідратації в Next.js
    immediatelyRender: false,
  });

  // Функція для додавання посилання
  // Використовуємо useCallback на верхньому рівні
  const setLink = useCallback(() => {
    if (!editor) return; // Додано перевірку наявності editor
    const previousUrl = editor.getAttributes('link').href
    const href = window.prompt('URL', previousUrl)

    // Якщо користувач скасував, не робити нічого
    if (href === null) {
      return
    }

    // Якщо url порожній, очистити посилання
    if (href === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()
      return
    }

    // Встановити посилання
    editor.chain().focus().extendMarkRange('link').setLink({ href })
      .run()
  }, [editor]);
  
  // Функція для додавання зображення
  // Використовуємо useCallback на верхньому рівні
  const addImage = useCallback(() => {
    if (!editor) return; // Додано перевірку наявності editor
    const url = window.prompt('URL зображення')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor]);

  // Синхронізуємо контент, якщо він зміниться ззовні
  useEffect(() => {
    if (editor && data !== editor.getHTML()) {
      editor.commands.setContent(data);
    }
  }, [data, editor]);

  if (!editor) {
    return null;
  }

  const toolbar = (
    <div className="tiptap-toolbar">
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Жирний
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Курсив
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        Список
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        H1
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        H2
      </button>
      <button
        type='button'
        onClick={setLink}
        className={editor.isActive('link') ? 'is-active' : ''}
      >
        Посилання
      </button>
      <button
        type='button' onClick={addImage}>
        Зображення
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHardBreak().run()}
      >
        Новий рядок
      </button>
    </div>
  );

  return (
    <>
      <style>{editorStyles}</style>
      <div className="tiptap-editor-container">
        {toolbar}
        <EditorContent editor={editor} className="tiptap-editor-content" />
      </div>
    </>
  );
};

export default TipTapEditor;
