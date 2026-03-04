'use client';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export function InsightOmnibar() {
  const [query, setQuery] = useState('');
  const { isProcessing, cognitiveStreamText, omnibarIntentColor, setProcessing, setEngineData } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    setProcessing(true, "Orchestrating...", "border-blue-500");

    // We use EventSource to get the cool real-time stream updates
    const eventSource = new EventSource(`/api/ask?query=${encodeURIComponent(query)}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Update UI state based on graph progress
        if (data.planner) {
            setProcessing(true, "Consulting Semantic Layer...", "border-purple-500");
        }

        // SCENARIO 1: Success
        if (data.executor) {
          const res = data.executor;
          setEngineData({ ...res });
          setProcessing(false, "Complete", "border-amber-500");
          eventSource.close(); // CRITICAL: Stop stream on success
          setQuery('');
        } 
        // SCENARIO 2: Graceful Backend Error (This fixes the "hey" bug!)
        else if (data.error) {
          console.error("Tri-Brain failed to process query:", data.error);
          setProcessing(false, "Query Rejected by AI", "border-red-500");
          eventSource.close(); // CRITICAL: Stop stream on AI error
        }

      } catch (err) {
        console.error("Failed to parse stream data:", err);
      }
    };

    // SCENARIO 3: Fatal Connection Error (The Ultimate Kill Switch)
    eventSource.onerror = (error) => {
      console.error("EventSource connection dropped:", error);
      setProcessing(false, "Connection Lost", "border-red-500");
      eventSource.close(); // CRITICAL: Stop the infinite loop!
    };
  };

  return (
    <div className="w-full flex flex-col items-center space-y-2">
      <div className="text-xs text-gray-400 uppercase font-mono tracking-widest">
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
          className={`w-full bg-gray-900/90 backdrop-blur-md text-white rounded-full px-6 py-4 border-2 outline-none transition-colors duration-300 ${omnibarIntentColor}`}
          disabled={isProcessing}
        />
      </form>
    </div>
  );
}
