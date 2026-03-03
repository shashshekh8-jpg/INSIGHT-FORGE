'use client';
import { useAppStore } from '@/lib/store';

export function Breadcrumbs() {
  const { uiMode, historyStack, revertToState } = useAppStore();

  return (
    <div className="flex space-x-2 text-sm text-gray-400 font-mono">
      <button
        onClick={() => revertToState(-1)}
        className={uiMode === 'galaxy' ? 'text-white font-bold' : ''}
      >
        State: Global
      </button>
      {historyStack.map((s, i) => (
        <button
          key={i}
          onClick={() => revertToState(i)}
          className="text-amber-400 font-bold"
        >
          / Filter: {s.engine_used}
        </button>
      ))}
    </div>
  );
}
