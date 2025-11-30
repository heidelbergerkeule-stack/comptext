// Simplified CompText Parser

export interface ASTNode {
  type: string;
  name?: string;
  params?: Record<string, any>;
  commands?: ASTNode[];
  branches?: ASTNode[];
  statements?: ASTNode[];
  line?: number;
  column?: number;
}

export class ParseError extends Error {
  constructor(
    message: string,
    public line: number = 1,
    public column: number = 1
  ) {
    super(message);
    this.name = 'ParseError';
  }
}

export function parse(source: string): ASTNode {
  const lines = source.split('\n');
  const statements: ASTNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip comments and empty lines
    if (!line || line.startsWith('#')) continue;
    
    try {
      const stmt = parseLine(line, i + 1);
      if (stmt) statements.push(stmt);
    } catch (e) {
      if (e instanceof ParseError) throw e;
      throw new ParseError(String(e), i + 1, 1);
    }
  }

  return { type: 'Program', statements };
}

function parseLine(line: string, lineNum: number): ASTNode | null {
  // Check for parallel (&)
  if (line.includes('&')) {
    const parts = line.split('&');
    return {
      type: 'Parallel',
      branches: parts.map(p => parseLine(p.trim(), lineNum)!).filter(Boolean),
      line: lineNum,
    };
  }

  // Check for pipeline (|)
  if (line.includes('|')) {
    const parts = line.split('|');
    return {
      type: 'Pipeline',
      commands: parts.map(p => parseCommand(p.trim(), lineNum)).filter(Boolean),
      line: lineNum,
    };
  }

  // Single command
  return parseCommand(line, lineNum);
}

function parseCommand(text: string, lineNum: number): ASTNode | null {
  if (!text.startsWith('CMD:')) {
    throw new ParseError(`Expected 'CMD:', got '${text.slice(0, 10)}...'`, lineNum, 1);
  }

  const parts = text.slice(4).split(';');
  const name = parts[0];
  const params: Record<string, any> = {};

  for (let i = 1; i < parts.length; i++) {
    const [key, ...valueParts] = parts[i].split(':');
    const value = valueParts.join(':');
    
    if (key && value) {
      // Handle comma-separated values
      params[key] = value.includes(',') ? value.split(',') : value;
    }
  }

  return { type: 'Command', name, params, line: lineNum };
}