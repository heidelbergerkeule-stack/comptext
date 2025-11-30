import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { parse, ParseError, ASTNode } from '@/lib/parser';
import LZString from 'lz-string';

interface PlaygroundState {
  code: string;
  ast: ASTNode | null;
  output: string;
  errors: Array<{ line: number; column: number; message: string }>;
  isExecuting: boolean;
  shareUrl: string | null;
  
  setCode: (code: string) => void;
  parse: (code: string) => void;
  execute: (code: string) => Promise<void>;
  loadExample: (code: string) => void;
  createShare: () => void;
  reset: () => void;
}

const DEFAULT_CODE = `# CompText Playground
# Try editing this example:

CMD:CODE;LNG:PY;FRM:FAST;AUTH:JWT;DB:PSQL

# Pipeline example:
# CMD:CODE;LNG:PY|CMD:TEST;COV:80|CMD:DOCK

# Parallel example:
# CMD:CODE;LNG:PY&CMD:CODE;LNG:TS`;

export const usePlaygroundStore = create<PlaygroundState>()(
  persist(
    (set, get) => ({
      code: DEFAULT_CODE,
      ast: null,
      output: '',
      errors: [],
      isExecuting: false,
      shareUrl: null,

      setCode: (code) => set({ code, shareUrl: null }),

      parse: (code) => {
        try {
          const ast = parse(code);
          set({ ast, errors: [] });
        } catch (e) {
          if (e instanceof ParseError) {
            set({
              ast: null,
              errors: [{ line: e.line, column: e.column, message: e.message }],
            });
          }
        }
      },

      execute: async (code) => {
        set({ isExecuting: true, output: '' });
        
        // Simulate execution
        await new Promise(r => setTimeout(r, 500));
        
        const ast = get().ast;
        const output = ast 
          ? `✓ Parsed successfully!\n\nAST:\n${JSON.stringify(ast, null, 2)}`
          : 'Parse error - cannot execute';
        
        set({ output, isExecuting: false });
      },

      loadExample: (code) => {
        set({ code, shareUrl: null });
        get().parse(code);
      },

      createShare: () => {
        const code = get().code;
        const compressed = LZString.compressToEncodedURIComponent(code);
        const url = `${window.location.origin}?c=${compressed}`;
        navigator.clipboard.writeText(url);
        set({ shareUrl: url });
      },

      reset: () => set({ code: DEFAULT_CODE, ast: null, output: '', errors: [], shareUrl: null }),
    }),
    {
      name: 'comptext-playground',
      partialize: (state) => ({ code: state.code }),
    }
  )
);