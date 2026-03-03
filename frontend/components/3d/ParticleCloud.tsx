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

  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 2,
    pitch: 45,
    transitionInterruption: TRANSITION_EVENTS.IGNORE
  });

  useEffect(() => {
    if (isProcessing)
      setViewState({
        ...viewState,
        zoom: 6,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator()
      });
  }, [isProcessing]);

  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={({ viewState }) => setViewState(viewState as any)}
      controller={!isProcessing}
      layers={[
        new ScatterplotLayer({
          id: 'cloud',
          data,
          getPosition: d => d.position,
          getFillColor: d => d.isFraud ? [255, 50, 50] : [50, 150, 255]
        })
      ]}
      style={{ backgroundColor: '#050505' }}
    />
  );
}
