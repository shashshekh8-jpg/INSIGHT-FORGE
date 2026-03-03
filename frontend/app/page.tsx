'use client';
import { useAppStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import { TransparencyAudit } from '@/components/dashboard/TransparencyAudit';

// SSR Safe-Guarding for WebGL contexts
const ParticleCloud = dynamic(() => import('@/components/3d/ParticleCloud').then(mod => mod.ParticleCloud), { ssr: false });
const BipartiteGraph = dynamic(() => import('@/components/3d/BipartiteGraph').then(mod => mod.BipartiteGraph), { ssr: false });
const TremorCharts = dynamic(() => import('@/components/dashboard/TremorCharts').then(mod => mod.TremorCharts), { ssr: false });

export default function EngineCanvas() {
  const { uiMode } = useAppStore();

  return (
    <div className="w-full h-full relative">
      {uiMode === 'galaxy' && <ParticleCloud />}
      {uiMode === 'corridor' && <BipartiteGraph />}
      {uiMode === 'lens' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-8">
          <TremorCharts />
        </div>
      )}
      <TransparencyAudit />
    </div>
  );
}
