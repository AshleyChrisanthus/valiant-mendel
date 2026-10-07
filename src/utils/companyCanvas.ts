import dagre from 'dagre';
import type {
  UnifiedCompanyData,
  CompanyCanvasNode,
  CompanyCanvasEdge,
  SubsidiaryRelation
} from '../types/company';

export interface LayoutOptions {
  direction?: 'TB' | 'LR';
  nodeWidth?: number;
  nodeHeight?: number;
}

/**
 * Normalizes unified corporate data into CanvasNodes & CanvasEdges,
 * and calculates positioning using Dagre layout.
 */
export function companyToCanvasGraph(
  data: UnifiedCompanyData,
  layoutDirection: 'TB' | 'LR' = 'LR'
): { nodes: CompanyCanvasNode[]; edges: CompanyCanvasEdge[] } {
  const rawNodes: CompanyCanvasNode[] = [];
  const rawEdges: CompanyCanvasEdge[] = [];

  // 1. Root Parent Node
  const rootNodeId = `node-root-${data.id || 'parent'}`;
  rawNodes.push({
    id: rootNodeId,
    type: 'companyNode',
    position: { x: 0, y: 0 },
    data: {
      id: rootNodeId,
      title: data.name,
      logoUrl: data.logoUrl || null,
      source: data.source,
      badge: data.badge || (data.source === 'wikidata' ? 'Conglomerate' : data.source === 'gleif' ? 'Ultimate Parent' : 'Registrant'),
      jurisdiction: data.jurisdiction,
      relationType: 'Ultimate Parent',
      lei: data.lei,
      cik: data.cik,
      description: data.description,
      hasChildren: (data.subsidiaries && data.subsidiaries.length > 0),
      childrenCount: data.subsidiaries ? data.subsidiaries.length : 0
    }
  });

  // 2. Recursive or Level-by-level subsidiary traversal
  function processSubsidiaries(subs: SubsidiaryRelation[], parentId: string, level = 1) {
    subs.forEach((sub, index) => {
      const nodeId = `node-sub-${sub.id || `${parentId}-${index}`}`;
      const hasChildren = Boolean(sub.children && sub.children.length > 0);

      rawNodes.push({
        id: nodeId,
        type: 'companyNode',
        position: { x: 0, y: 0 },
        data: {
          id: nodeId,
          title: sub.name,
          logoUrl: sub.logoUrl || null,
          source: sub.source || data.source,
          badge: sub.badge || sub.relationType || 'Subsidiary',
          jurisdiction: sub.jurisdiction,
          relationType: sub.relationType || 'Subsidiary',
          lei: sub.lei,
          cik: sub.cik,
          description: sub.description,
          hasChildren,
          childrenCount: sub.children ? sub.children.length : 0
        }
      });

      // Edge from parent to this subsidiary
      rawEdges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        label: sub.relationType || 'Subsidiary',
        relationType: sub.relationType,
        animated: level === 1,
        style: { stroke: 'var(--accent)', strokeWidth: 1.5 }
      });

      if (hasChildren && sub.children) {
        processSubsidiaries(sub.children, nodeId, level + 1);
      }
    });
  }

  if (data.subsidiaries && data.subsidiaries.length > 0) {
    processSubsidiaries(data.subsidiaries, rootNodeId);
  }

  // 3. Apply Dagre auto-layout
  return applyDagreLayout(rawNodes, rawEdges, layoutDirection);
}

/**
 * Applies Dagre automatic hierarchical layout
 */
export function applyDagreLayout(
  nodes: CompanyCanvasNode[],
  edges: CompanyCanvasEdge[],
  direction: 'TB' | 'LR' = 'LR'
): { nodes: CompanyCanvasNode[]; edges: CompanyCanvasEdge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isLR = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    ranksep: isLR ? 140 : 100,
    nodesep: isLR ? 50 : 70
  });

  const nodeWidth = 280;
  const nodeHeight = 130;

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const positionedNodes = nodes.map((node) => {
    const nodeWithPos = dagreGraph.node(node.id);
    if (!nodeWithPos) return node;

    return {
      ...node,
      position: {
        x: nodeWithPos.x - nodeWidth / 2,
        y: nodeWithPos.y - nodeHeight / 2
      }
    };
  });

  return { nodes: positionedNodes, edges };
}
