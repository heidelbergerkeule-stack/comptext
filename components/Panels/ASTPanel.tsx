'use client';

import { cn } from '@/lib/utils';

interface ASTNode {
  type: string;
  name?: string;
  params?: Record<string, any>;
  commands?: ASTNode[];
  branches?: ASTNode[];
  statements?: ASTNode[];
}

export function ASTPanel({ ast }: { ast: ASTNode | null }) {
  if (!ast) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Enter CompText to see AST
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4 font-mono text-sm">
      <ASTTree node={ast} depth={0} />
    </div>
  );
}

function ASTTree({ node, depth }: { node: ASTNode; depth: number }) {
  const indent = depth * 16;

  if (node.type === 'Program') {
    return (
      <div>
        <div className="text-blue-500 font-bold" style= marginLeft: indent >
          📄 Program
        </div>
        {node.statements?.map((stmt, i) => (
          <ASTTree key={i} node={stmt} depth={depth + 1} />
        ))}
      </div>
    );
  }

  if (node.type === 'Pipeline') {
    return (
      <div>
        <div className="text-yellow-500" style= marginLeft: indent >
          ⛓️ Pipeline
        </div>
        {node.commands?.map((cmd, i) => (
          <div key={i}>
            <ASTTree node={cmd} depth={depth + 1} />
            {i < (node.commands?.length || 0) - 1 && (
              <div className="text-yellow-500/50 text-xs" style= marginLeft: indent + 32 >↓</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (node.type === 'Parallel') {
    return (
      <div>
        <div className="text-green-500" style= marginLeft: indent >
          ⚡ Parallel
        </div>
        <div className="flex gap-4" style= marginLeft: indent + 16 >
          {node.branches?.map((b, i) => (
            <div key={i} className="border-l-2 border-green-500/30 pl-2">
              <ASTTree node={b} depth={0} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (node.type === 'Command') {
    return (
      <div 
        className="bg-secondary/50 rounded p-2 my-1 inline-block"
        style= marginLeft: indent 
      >
        <span className="text-purple-500">CMD:</span>
        <span className="text-cyan-400 font-bold">{node.name}</span>
        {node.params && Object.entries(node.params).map(([k, v]) => (
          <span key={k} className="ml-2">            <span className="text-orange-400">{k}:</span>
            <span className="text-emerald-400">{String(v)}</span>
          </span>
        ))}
      </div>
    );
  }

  return null;
}