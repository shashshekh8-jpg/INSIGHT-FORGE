'use client';
import { Card, BarChart, Text, Metric } from '@tremor/react';
import { useAppStore } from '@/lib/store';

export function TremorCharts() {
  const { isProcessing, engineData } = useAppStore();

  if (isProcessing)
    return (
      <div className="w-full space-y-6 animate-pulse">
        <Card className="h-32 bg-gray-900" />
        <Card className="h-80 bg-gray-900" />
      </div>
    );

  return (
    <div className="w-full space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <Text className="text-gray-400">Causal Summary</Text>
        <Metric className="text-white">{engineData?.result?.interpretation}</Metric>
      </Card>
      <Card className="bg-gray-900 border-gray-800">
        <BarChart
          data={[{ name: 'Android', 'Rate': 12.5 }, { name: 'iOS', 'Rate': 2.1 }]}
          index="name"
          categories={["Rate"]}
          colors={["blue"]}
        />
      </Card>
    </div>
  );
}
