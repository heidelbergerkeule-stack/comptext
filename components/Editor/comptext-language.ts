import type { Monaco } from '@monaco-editor/react';

export function registerCompTextLanguage(monaco: Monaco) {
  // Register language
  monaco.languages.register({ id: 'comptext' });

  // Define themes
  monaco.editor.defineTheme('comptext-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '569cd6', fontStyle: 'bold' },
      { token: 'command', foreground: '4ec9b0', fontStyle: 'bold' },
      { token: 'parameter', foreground: '9cdcfe' },
      { token: 'value', foreground: 'ce9178' },
      { token: 'operator', foreground: 'd4d4d4' },
      { token: 'comment', foreground: '6a9955' },
      { token: 'variable', foreground: 'dcdcaa' },
    ],
    colors: {
      'editor.background': '#0d1117',
    },
  });

  monaco.editor.defineTheme('comptext-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0000ff', fontStyle: 'bold' },
      { token: 'command', foreground: '267f99', fontStyle: 'bold' },
      { token: 'parameter', foreground: '001080' },
      { token: 'value', foreground: 'a31515' },
      { token: 'operator', foreground: '000000' },
      { token: 'comment', foreground: '008000' },
      { token: 'variable', foreground: '795e26' },
    ],
    colors: {},
  });

  // Tokenizer
  monaco.languages.setMonarchTokensProvider('comptext', {
    tokenizer: {
      root: [
        [/#.*$/, 'comment'],
        [/\bCMD\b/, 'keyword'],
        [/(?<=CMD:)[A-Z]+/, 'command'],
        [/\b(LNG|FRM|TYP|TASK|AUTH|DB|ORM|CRUD|VAL|ERR|COV|ENV|SRC|MDL|METRIC|PLOT|FMT|SDK|STYLE|CMPN|RESP|ANIM|THEME|FB|TIMEOUT|STG|OPT|SVC|DEPL|HPA|ING|HEALTH|RES|CFG|SEC)\b/, 'parameter'],
        [/\b(PY|TS|JS|JAVA|GO|RUST|CSHARP|FAST|FLASK|DJANGO|EXPRESS|NEST|REACT|NEXT|VUE|SVELTE|PSQL|MYSQL|MONGO|SQLITE|REDIS|JWT|OAUTH2|APIKEY|SESSION|UNIT|INTEG|E2E|PERF|Y|N|MULTI|ALPINE|SLIM|LB|TLS)\b/, 'value'],
        [/\|/, 'operator'],
        [/&/, 'operator'],
        [/;/, 'operator'],
        [/:/, 'operator'],
        [/\$[a-zA-Z_]\w*/, 'variable'],
        [/\d+/, 'number'],
        [/"[^"]*"/, 'string'],
      ],
    },
  });

  // Completions
  monaco.languages.registerCompletionItemProvider('comptext', {
    triggerCharacters: [':', ';', '|', '&'],
    provideCompletionItems: (model, position) => {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: any[] = [];

      if (textUntilPosition.endsWith('CMD:') || textUntilPosition.match(/[|&]$/)) {
        const commands = [
          { label: 'CODE', detail: 'Generate source code' },
          { label: 'TEST', detail: 'Create tests' },
          { label: 'API', detail: 'Build API' },
          { label: 'DOCK', detail: 'Docker config' },
          { label: 'K8S', detail: 'Kubernetes setup' },
          { label: 'UI', detail: 'UI components' },
          { label: 'ML', detail: 'ML pipeline' },
          { label: 'DOC', detail: 'Documentation' },
        ];
        commands.forEach(cmd => {
          suggestions.push({
            label: cmd.label,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: textUntilPosition.match(/[|&]$/) ? `CMD:${cmd.label}` : cmd.label,
            detail: cmd.detail,
            range,
          });
        });
      }

      if (textUntilPosition.endsWith(';')) {
        const params = ['LNG', 'FRM', 'TYP', 'AUTH', 'DB', 'COV', 'STYLE', 'RESP'];
        params.forEach(p => {
          suggestions.push({
            label: p,
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: `${p}:`,
            range,
          });
        });
      }

      if (textUntilPosition.match(/LNG:$/)) {
        ['PY', 'TS', 'JS', 'GO', 'RUST', 'JAVA'].forEach(v => {
          suggestions.push({
            label: v,
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: v,
            range,
          });
        });
      }

      return { suggestions };
    },
  });
}