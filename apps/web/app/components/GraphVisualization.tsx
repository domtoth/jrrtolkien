'use client';

import { useCallback, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { GraphData, EntityType } from '@/lib/types';
import { useRouter } from 'next/navigation';

const nodeColors: Record<EntityType, string> = {
  [EntityType.CHARACTER]: '#3b82f6', // blue
  [EntityType.PLACE]: '#10b981', // green
  [EntityType.ARTIFACT]: '#a855f7', // purple
  [EntityType.EVENT]: '#f97316', // orange
  [EntityType.GROUP]: '#ec4899', // pink
};

interface GraphVisualizationProps {
  data: GraphData;
  centerSlug: string;
}

export default function GraphVisualization({ data, centerSlug }: GraphVisualizationProps) {
  const router = useRouter();
  const forceRef = useRef<any>();

  const handleNodeClick = useCallback(
    (node: any) => {
      if (node.slug && node.slug !== centerSlug) {
        router.push(`/entity/${node.slug}`);
      }
    },
    [centerSlug, router]
  );

  const graphData = {
    nodes: data.nodes.map((node) => ({
      id: node.id,
      name: node.name,
      slug: node.slug,
      type: node.type,
      val: node.slug === centerSlug ? 15 : 10,
      color: nodeColors[node.type],
    })),
    links: data.edges.map((edge) => ({
      source: edge.from,
      target: edge.to,
      label: edge.predicate,
    })),
  };

  return (
    <div className="w-full h-[600px] border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
      <ForceGraph2D
        ref={forceRef}
        graphData={graphData}
        nodeLabel={(node: any) => node.name}
        nodeColor={(node: any) => node.color}
        nodeRelSize={6}
        linkLabel={(link: any) => link.label}
        linkColor={() => '#94a3b8'}
        linkWidth={2}
        onNodeClick={handleNodeClick}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color;
          
          // Draw node circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
          ctx.fill();
          
          // Draw label
          ctx.fillStyle = '#1e293b';
          ctx.fillText(label, node.x, node.y + node.val / 2 + fontSize + 2);
        }}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
      />
    </div>
  );
}

