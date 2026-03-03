'use client';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export function InsightOmnibar() {
  const [query, setQuery] = useState('');
  const { isProcessing, cognitiveStreamText, omnibarIntentColor, setProcessing, setEngineData } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setProcessing(true, "Orchestrating...", "border-blue-500");

    // Server-Sent Events (SSE) stream for real-time telemetry
    const eventSource = new EventSource(`/api/ask?query=${encodeURIComponent(query)}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.planner) setProcessing(true, "Consulting Semantic Layer...", "border-purple-500");
      if (data.executor) {
        const res = data.executor;
        setEngineData({ ...res });
        setProcessing(false, "Complete", "border-amber-500");
        eventSource.close();
      }
    };
  };

  return (
    <div className="w-full flex flex-col items-center space-y-2">
      <div className="text-xs text-gray-400 uppercase">
        {isProcessing ? (
          <span className="animate-pulse">{cognitiveStreamText}</span>
        ) : (
          <span>{cognitiveStreamText}</span>
        )}
      </div>
      <form onSubmit={handleSubmit} className="w-full">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask anything..."
          className={`w-full bg-gray-900 text-white rounded-full px-6 py-4 border-2 ${omnibarIntentColor}`}
          disabled={isProcessing}
        />
      </form>
    </div>
  );
}
