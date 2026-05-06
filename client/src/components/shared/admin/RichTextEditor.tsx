import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }],
      ['clean'],
    ],
  };

  const formats = [
    'size',
    'bold', 'italic', 'underline',
    'color',
  ];

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:border-orange-600/50 transition-colors">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="min-h-[150px]"
      />
      <style>{`
        .ql-container.ql-snow {
          border: none !important;
          font-family: inherit;
        }
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background-color: #f8fafc;
        }
        .ql-editor {
          min-height: 150px;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
