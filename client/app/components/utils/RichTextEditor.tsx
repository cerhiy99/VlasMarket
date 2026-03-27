// components/RichTextEditor.tsx
'use client'
import React, { useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Paragraph from '@editorjs/paragraph'
import ImageTool from '@editorjs/image'
import { $authHost } from '@/app/http'
import './RichTextEditor.scss' // ІМПОРТУЄМО ФАЙЛ СТИЛІВ

interface RichTextEditorProps {
  data: any // JSON-об'єкт з даними редактора
  onChange: (data: any) => void // Колбек для повернення оновлених даних
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ data, onChange }) => {
  const editorRef = useRef<EditorJS | null>(null)
  const isInitialized = useRef<boolean>(false)

  useEffect(() => {
    // Ініціалізуємо EditorJS тільки один раз
    if (!isInitialized.current) {
      editorRef.current = new EditorJS({
        holder: 'editorjs-container', // ID елементу, де буде редактор
        data: data,
        // Явно вказуємо, що тип може бути будь-яким, щоб уникнути конфліктів
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool,
            config: {
                uploader: {
                    uploadByFile: async (file: File) => {
                        // Логіка завантаження файлу на ваш сервер
                        const formData = new FormData();
                        formData.append('image', file);

                        try {
                            // Передаємо formData у другому параметрі axios.post
                            const response = await $authHost.post('rich-text-editor/upload', formData);
                            
                            // Якщо Axios успішно отримав відповідь, повертаємо її дані
                            const result = response.data;
                            
                            // EditorJS очікує такий формат відповіді
                            return {
                                success: 1, // 1 означає успіх
                                file: {
                                    url: result.imageUrl,
                                },
                            };
                        } catch (error) {
                            console.error('Помилка завантаження зображення:', error);
                            return {
                                success: 0, // 0 означає помилку
                                message: 'Помилка завантаження зображення',
                            };
                        }
                    },
                },
            },
          },
        } as any, // Використання 'as any' для об'єкта tools
        onChange: async () => {
          if (editorRef.current) {
            const savedData = await editorRef.current.save()
            onChange(savedData)
          }
        },
      })
      isInitialized.current = true
    }

    // При розмонтуванні компонента, знищуємо екземпляр EditorJS
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
        isInitialized.current = false
      }
    }
  }, [data, onChange])

  return <div id='editorjs-container' className='editor-container' />
}

export default RichTextEditor
