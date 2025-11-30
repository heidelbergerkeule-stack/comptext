'use client';

import { useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { usePlaygroundStore } from '@/stores/playground-store';
import { MonacoEditor } from '@/components/Editor/MonacoEditor';
import { ASTPanel } from '@/components/Panels/ASTPanel';
import { OutputPanel } from '@/components/Panels/OutputPanel';
import { TokenPanel } from '@/components/Panels/TokenPanel';
import { ExamplesPanel } from '@/components/Panels/ExamplesPanel';
import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Share2, Check, AlertCircle } from 'lucide-react';

export default function Playground() {
  const { 
    code, 
    setCode, 
    ast, 
    output, 
    errors,
    isExecuting,
    parse,
    execute,
    shareUrl,
    createShare,
  } = usePlaygroundStore();

  // Auto-parse on code change
  useEffect(() => {
    const timer = setTimeout(() => {
      parse(code);
    }, 300);
    return () => clearTimeout(timer);
  }, [code, parse]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Left: Editor */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              <div className="flex-1">
                <MonacoEditor
                  value={code}
                  onChange={setCode}
                  errors={errors}
                />
              </div>
              <ExamplesPanel />
            </div>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-border hover:bg-primary/50 transition-colors cursor-col-resize" />

          {/* Right: Output */}
          <Panel defaultSize={50} minSize={30}>
            <Tabs defaultValue="output" className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <TabsList>
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="ast">AST</TabsTrigger>
                  <TabsTrigger value="tokens">Tokens</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  {errors.length > 0 ? (
                    <span className="flex items-center gap-1 text-sm text-destructive">                      <AlertCircle className="w-4 h-4" /></span>
<span className="flex items-center gap-1 text-sm text-destructive">                      {errors.length} error(s)</span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-green-500">                      <Check className="w-4 h-4" /></span>
<span className="flex items-center gap-1 text-sm text-green-500">                      Valid</span>
                  )}
                </div>
              </div>
              
              <TabsContent value="output" className="flex-1 m-0 overflow-hidden">
                <OutputPanel output={output} isLoading={isExecuting} />
              </TabsContent>
              
              <TabsContent value="ast" className="flex-1 m-0 overflow-hidden">
                <ASTPanel ast={ast} />
              </TabsContent>
              
              <TabsContent value="tokens" className="flex-1 m-0 overflow-hidden">
                <TokenPanel code={code} />
              </TabsContent>
            </Tabs>
          </Panel>
        </PanelGroup>
      </main>

      {/* Footer */}
      <footer className="h-14 border-t flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => execute(code)}
            disabled={isExecuting || errors.length > 0}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isExecuting ? 'Running...' : 'Run'}
          </Button>
          
          <Button variant="outline" onClick={createShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          
          {shareUrl && (
            <span className="text-sm text-muted-foreground ml-2">              Copied: {shareUrl}</span>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          CompText Playground v1.0
        </div>
      </footer>
    </div>
  );
}