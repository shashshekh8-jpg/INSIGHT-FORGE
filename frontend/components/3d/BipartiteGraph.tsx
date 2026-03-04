'use client';
import DeckGL from '@deck.gl/react';
import { LineLayer, TextLayer } from '@deck.gl/layers';
import { useAppStore } from '@/lib/store';

export function BipartiteGraph() {
  const { engineData } = useAppStore();
  const corridor = engineData?.result?.top_corridor || ['Bihar', 'Kotak Bank'];
  const nodes = [
    { name: corridor[0], position: [-50, 20, 0] as [number, number, number] },
    { name: corridor[1], position: [50, -20, 0] as [number, number, number] }
  ];

  return (
    <div className="w-full h-full">
        <DeckGL 
            initialViewState={{ zoom: 4 }} 
            layers={[
                new LineLayer({ 
                    id: 'vectors', 
                    data: [{ source: nodes[0].position, target: nodes[1].position }], 
                    getSourcePosition: (d: any) => d.source, 
                    getTargetPosition: (d: any) => d.target, 
                    getColor: [255, 0, 0], 
                    getWidth: 10 
                }), 
                new TextLayer({ 
                    id: 'labels', 
                    data: nodes, 
                    getPosition: (d: any) => d.position, 
                    getText: (d: any) => d.name, 
                    getSize: 24 
                })
            ]} 
            style={{ backgroundColor: '#050505' }} 
        />
        <div className="absolute top-1/4 right-8 w-80 bg-black/80 border border-red-500/50 p-6 rounded-xl text-white">
            <h3 className="text-red-500 font-bold">Systemic Risk Detected</h3>
            <p>{engineData?.result?.summary || "Toxic corridor isolated."}</p>
        </div>
    </div>
  );
}
