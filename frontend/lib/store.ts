import { create } from 'zustand';

interface EnginePayload {
  semantic_intent: string;
  engine_used: string;
  generated_code: string;
  result: any;
}

interface AppState {
  uiMode: 'galaxy' | 'lens' | 'corridor';
  isProcessing: boolean;
  cognitiveStreamText: string;
  omnibarIntentColor: string;
  engineData: EnginePayload | null;
  historyStack: EnginePayload[];
  setProcessing: (s: boolean, t: string, c: string) => void;
  setEngineData: (d: EnginePayload) => void;
  revertToState: (i: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  uiMode: 'galaxy',
  isProcessing: false,
  cognitiveStreamText: 'Ready',
  omnibarIntentColor: 'border-gray-700',
  engineData: null,
  historyStack: [],
  setProcessing: (s, t, c) => set({ isProcessing: s, cognitiveStreamText: t, omnibarIntentColor: c }),
  setEngineData: (d) => set(state => ({
    engineData: d,
    uiMode: d.engine_used.includes('NetworkX') ? 'corridor' : 'lens',
    historyStack: [...state.historyStack, d]
  })),
  revertToState: (i) => set(state =>
    i === -1
      ? { uiMode: 'galaxy', engineData: null, historyStack: [] }
      : { uiMode: 'lens', engineData: state.historyStack[i], historyStack: state.historyStack.slice(0, i + 1) }
  )
}));
