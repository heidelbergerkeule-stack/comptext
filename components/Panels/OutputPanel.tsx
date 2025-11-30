'use client';

import { Loader2 } from 'lucide-react';

interface Props {
  output: string;
  isLoading: boolean;
}

export function OutputPanel({ output, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!output) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Click "Run" to execute CompText
      </div>
    );
  }

  return (
    <pre className="h-full overflow-auto p-4 font-mono text-sm whitespace-pre-wrap">
      {output}
    </pre>
  );
}