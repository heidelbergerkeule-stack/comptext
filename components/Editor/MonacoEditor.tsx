'use client';

import { useRef, useEffect } from 'react';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { registerCompTextLanguage } from './comptext-language';

interface Props {
  value: string;
  onChange: (value: string) => void;
  errors?: Array<{ line: number; column: number; message: string }>;
}

export function MonacoEditor({ value, onChange, errors = [] }: Props) {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    registerCompTextLanguage(monaco);
    editor.focus();
  };

  // Sync errors
  useEffect(() => {
    if (!monacoRef.current || !editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    const markers = errors.map(err => ({
      severity: monacoRef.current!.MarkerSeverity.Error,
      startLineNumber: err.line,
      startColumn: err.column,
      endLineNumber: err.line,
      endColumn: err.column + 10,
      message: err.message,
    }));

    monacoRef.current.editor.setModelMarkers(model, 'comptext', markers);
  }, [errors]);

  return (
    <Editor
      height="100%"
      language="comptext"
      theme={theme === 'dark' ? 'comptext-dark' : 'comptext-light'}
      value={value}
      onChange={(val) => onChange(val || '')}
      onMount={handleMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
        lineNumbers: 'on',
        wordWrap: 'on',
        automaticLayout: true,
        tabSize: 2,
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        bracketPairColorization: { enabled: true },
      }}
    />
  );
}