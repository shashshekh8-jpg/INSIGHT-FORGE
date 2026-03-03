'use client';
import { useAppStore } from '@/lib/store';

export function TransparencyAudit() {
  const { engineData, uiMode } = useAppStore();

  if (uiMode === 'galaxy' || !engineData) return null;

  return (
    <div className="absolute right-0 h-full w-96 bg-gray-950 border-l border-gray-800 p-6 z-40">
      <h2 className="text-xl font-bold mb-6">Logic Audit Trail</h2>
      <div className="space-y-6 text-sm">
        <div>
          <h3 className="text-gray-400 text-xs mb-2 uppercase">Semantic Intent</h3>
          <div className="bg-gray-900 p-3 text-blue-400 font-mono">{engineData.semantic_intent}</div>
        </div>
        <div>
          <h3 className="text-gray-400 text-xs mb-2 uppercase">Engine Selected</h3>
          <div className="bg-gray-900 p-3 text-amber-400 font-mono">{engineData.engine_used}</div>
        </div>
        <div>
          <h3 className="text-gray-400 text-xs mb-2 uppercase">Execution Code</h3>
          <div className="bg-gray-900 p-3 text-green-400 font-mono">{engineData.generated_code}</div>
        </div>
      </div>
    </div>
  );
}
