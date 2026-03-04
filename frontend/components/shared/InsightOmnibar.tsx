'use client';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export function InsightOmnibar() {
  const [query, setQuery] = useState('');
  const { isProcessing, cognitiveStreamText, omnibarIntentColor, setProcessing, setEngineData } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Added safety check so users can't spam enter while it's already processing
    if (!query.trim() || isProcessing) return;

    setProcessing(true, "Orchestrating...", "border-blue-500");

    try {
      // Swapped EventSource for a standard one-time fetch call
      const response = await fetch(`/api/ask?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      // Ensure we extract the actual payload correctly based on how your backend wraps it.
      // If your backend returns {"response": { ...engineData... }} we grab data.response
      const payload = data.response || data; 

      setEngineData(payload);
      setProcessing(false, "Complete", "border-amber-500");
      setQuery(''); // Clear the input after a successful query

    } catch (error) {
      console.error("Query failed:", error);
      setProcessing(false, "Failed to connect to Tri-Brain", "border-red-500");
    }
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
