'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Github } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎮</span>
        <h1 className="font-bold text-lg">CompText Playground</h1>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">          v3.5.1</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
        
        <Button variant="ghost" size="icon" asChild>
          <a href="https://github.com" target="_blank" rel="noopener">
            <Github className="w-5 h-5" />
          </a>
        </Button>
      </div>
    </header>
  );
}