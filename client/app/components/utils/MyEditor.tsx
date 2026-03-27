/*"use client";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-build-classic';

interface MyEditorProps {
  data: string;
  onChange: (data: string) => void;
}

export default function MyEditor({ data, onChange }: MyEditorProps) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      onChange={(_, editor) => onChange(editor.getData())}
      config={{
        toolbar: [
          'heading', '|',
          'bold', 'italic', 'link', 
          'bulletedList', 'numberedList', '|',
          'insertTable', 'blockQuote', '|',
          'undo', 'redo', '|',
          'imageUpload'
        ]
      }}
    />
  );
}
*/