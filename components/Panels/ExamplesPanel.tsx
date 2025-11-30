'use client';

import { usePlaygroundStore } from '@/stores/playground-store';
import { EXAMPLES } from '@/lib/examples';
import { Button } from '@/components/ui/button';

export function ExamplesPanel() {
  const loadExample = usePlaygroundStore(s => s.loadExample);

  return (
    <div className="h-14 border-t flex items-center gap-2 px-4 overflow-x-auto">
      <span className="text-sm text-muted-foreground shrink-0">Examples:</span>
      {EXAMPLES.slice(0, 8).map(ex => (
        <Button
          key={ex.id}
          variant="outline"
          size="sm"
          onClick={() => loadExample(ex.code)}
          className="shrink-0"
        >
          {ex.name}
        </Button>
      ))}
    </div>
  );
}