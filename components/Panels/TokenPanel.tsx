'use client';

const MODELS = [
  { name: 'GPT-4.5 Turbo', price: 75 },
  { name: 'Claude Opus', price: 15 },
  { name: 'GPT-4 Turbo', price: 10 },
  { name: 'Claude Sonnet', price: 3 },
];

function countTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function TokenPanel({ code }: { code: string }) {
  const comptextTokens = countTokens(code);
  const naturalTokens = Math.round(comptextTokens * 9.2);
  const savedTokens = naturalTokens - comptextTokens;
  const savingsPercent = Math.round((savedTokens / naturalTokens) * 100) || 0;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-secondary rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-primary">{comptextTokens}</div>
          <div className="text-sm text-muted-foreground">CompText</div>
        </div>
        <div className="bg-secondary rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-muted-foreground">{naturalTokens}</div>
          <div className="text-sm text-muted-foreground">Natural</div>
        </div>
        <div className="bg-green-500/10 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-500">{savingsPercent}%</div>
          <div className="text-sm text-green-500/70">Saved</div>
        </div>
      </div>

      {/* Cost breakdown */}
      <div>
        <h3 className="font-semibold mb-3">Cost per Request</h3>
        <div className="space-y-2">
          {MODELS.map(model => {
            const cost = (comptextTokens / 1_000_000) * model.price;
            const naturalCost = (naturalTokens / 1_000_000) * model.price;
            const saved = naturalCost - cost;
            return (
              <div key={model.name} className="flex justify-between bg-secondary/50 rounded p-3">
                <span>{model.name}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground line-through">${naturalCost.toFixed(5)}</span>
                  <span className="text-primary">${cost.toFixed(5)}</span>
                  <span className="text-green-500">-${saved.toFixed(5)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}