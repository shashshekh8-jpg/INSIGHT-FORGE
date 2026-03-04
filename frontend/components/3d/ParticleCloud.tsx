'use client';
import { useMemo, useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { FlyToInterpolator, TRANSITION_EVENTS } from '@deck.gl/core';
import { useAppStore } from '@/lib/store';

export function ParticleCloud() {
  const { isProcessing, engineData } = useAppStore();
  
  const data = useMemo(() => {
      // Logic to map real embeddings if available
      return Array.from({ length: 5000 }).map(() => ({ 
          position: [Math.random() * 360 - 180, Math.random() * 180 - 90, Math.random() * 1000], 
          isFraud: Math.random() > 0.95 
      }));
  }, [engineData]);

  // FIX 1: Added <any> to allow dynamic animation properties
  const [viewState, setViewState] = useState<any>({ 
      longitude: 0, 
      latitude: 0, 
      zoom: 2, 
      pitch: 45, 
      transitionInterruption: TRANSITION_EVENTS.IGNORE 
  });

  useEffect(() => {
    if (isProcessing) {
        setViewState({ 
            ...viewState, 
            zoom: 6, 
            transitionDuration: 3000, 
            transitionInterpolator: new FlyToInterpolator() 
        });
    }
  }, [isProcessing, viewState]);

  return (
      <DeckGL 
          viewState={viewState} 
          // FIX 2: Explicitly type the event object as 'any' to avoid destructuring type errors
          onViewStateChange={(e: any) => setViewState(e.viewState)} 
          controller={!isProcessing} 
          layers={[
              new ScatterplotLayer({ 
                  id: 'cloud', 
                  data, 
                  getPosition: (d: any) => d.position, 
                  getFillColor: (d: any) => d.isFraud ? [255, 50, 50] : [50, 150, 255] 
              })
          ]} 
          style={{ backgroundColor: '#050505' }} 
      />
  );
}
