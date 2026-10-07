import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Plus,
  Sparkles,
  Maximize2,
  Trash2,
  Download,
  Share2,
  Layers,
  ArrowRight,
  ArrowDown,
  RotateCcw,
  Building2,
  FileText,
  Search,
  Palette
} from 'lucide-react';
import { CompanyNode } from './CompanyNode';
import { CompanySearchModal } from './CompanySearchModal';
import { CompanyDetailModal } from './CompanyDetailModal';
import { ThemeModal } from '../ThemeModal';
import {
  getAllCanvases,
  saveCanvas,
  deleteCanvas
} from '../../db';
import {
  companyToCanvasGraph,
  applyDagreLayout
} from '../../utils/companyCanvas';
import { CURATED_COMPANY_PROFILES } from '../../services/curatedData';
import type {
  UnifiedCompanyData,
  CompanyHierarchyCanvas,
  CanvasNodeData,
  CompanySource
} from '../../types/company';

const nodeTypes = {
  companyNode: CompanyNode
};

export const CompanyCanvasView: React.FC = () => {
  const [canvases, setCanvases] = useState<CompanyHierarchyCanvas[]>([]);
  const [activeCanvas, setActiveCanvas] = useState<CompanyHierarchyCanvas | null>(null);
  const [layoutDirection, setLayoutDirection] = useState<'LR' | 'TB'>('LR');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [inspectedNode, setInspectedNode] = useState<CanvasNodeData | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Load existing canvases from Dexie on mount
  useEffect(() => {
    async function loadInitial() {
      const stored = await getAllCanvases();
      setCanvases(stored);
      if (stored.length > 0) {
        selectCanvas(stored[0]);
      } else {
        // Create initial default sample (Disney)
        loadDefaultSample();
      }
    }
    loadInitial();
  }, []);

  const loadDefaultSample = async () => {
    // Import curated Disney graph on first run
    const initialGraph = companyToCanvasGraph(CURATED_COMPANY_PROFILES.disney, 'LR');

    const defaultCanvas: CompanyHierarchyCanvas = {
      id: `canvas-${Date.now()}`,
      name: 'The Walt Disney Company Hierarchy',
      companyName: 'The Walt Disney Company',
      source: 'wikidata',
      description: 'Brand architectures, consumer studios, and asset divisions',
      nodes: initialGraph.nodes,
      edges: initialGraph.edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveCanvas(defaultCanvas);
    setCanvases([defaultCanvas]);
    selectCanvas(defaultCanvas);
  };

  const selectCanvas = (canvas: CompanyHierarchyCanvas) => {
    setActiveCanvas(canvas);
    // Wire up node callbacks
    const wiredNodes = canvas.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onInspect: (data: CanvasNodeData) => setInspectedNode(data),
        onDelete: (id: string) => handleDeleteNode(id),
        onExpand: (id: string) => handleExpandNode(id)
      }
    }));
    setNodes(wiredNodes);
    setEdges(canvas.edges);

    setTimeout(() => {
      reactFlowInstance?.fitView({ padding: 0.2, duration: 400 });
    }, 50);
  };

  // Node actions
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, [setNodes, setEdges]);

  const handleExpandNode = useCallback((nodeId: string) => {
    // Toggle highlight or visual pulse
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, selected: true } : n))
    );
  }, [setNodes]);

  // Auto-Save changes back to Dexie
  useEffect(() => {
    if (!activeCanvas) return;
    const timeout = setTimeout(() => {
      const cleanNodes = nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: {
          id: (n.data as any).id,
          title: (n.data as any).title,
          logoUrl: (n.data as any).logoUrl,
          source: (n.data as any).source,
          badge: (n.data as any).badge,
          jurisdiction: (n.data as any).jurisdiction,
          relationType: (n.data as any).relationType,
          lei: (n.data as any).lei,
          cik: (n.data as any).cik,
          description: (n.data as any).description,
          hasChildren: (n.data as any).hasChildren,
          childrenCount: (n.data as any).childrenCount
        }
      }));

      const cleanEdges = edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: (e.label as string) || undefined,
        relationType: (e as any).relationType,
        animated: e.animated,
        style: e.style as any
      }));

      const updated: CompanyHierarchyCanvas = {
        ...activeCanvas,
        nodes: cleanNodes,
        edges: cleanEdges,
        updatedAt: new Date().toISOString()
      };

      saveCanvas(updated).then(() => {
        setCanvases((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      });
    }, 600);

    return () => clearTimeout(timeout);
  }, [nodes, edges, activeCanvas]);

  // Re-layout with Dagre
  const handleAutoLayout = (direction: 'LR' | 'TB') => {
    setLayoutDirection(direction);
    const layouted = applyDagreLayout(nodes as any, edges as any, direction);
    // Rewire node callbacks
    const wired = layouted.nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        onInspect: (data: CanvasNodeData) => setInspectedNode(data),
        onDelete: (id: string) => handleDeleteNode(id),
        onExpand: (id: string) => handleExpandNode(id)
      }
    }));
    setNodes(wired as Node[]);
    setEdges(layouted.edges as Edge[]);
    setTimeout(() => {
      reactFlowInstance?.fitView({ padding: 0.2, duration: 400 });
    }, 50);
  };

  // Import New Company from Search
  const handleImportToCanvas = (data: UnifiedCompanyData) => {
    const graph = companyToCanvasGraph(data, layoutDirection);
    const newCanvas: CompanyHierarchyCanvas = {
      id: `canvas-${Date.now()}`,
      name: `${data.name} Hierarchy`,
      companyName: data.name,
      source: data.source,
      description: data.description || `Imported from ${data.source.toUpperCase()}`,
      nodes: graph.nodes,
      edges: graph.edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveCanvas(newCanvas).then(() => {
      setCanvases((prev) => [newCanvas, ...prev]);
      selectCanvas(newCanvas);
    });
  };

  // Export Canvas JSON
  const handleExportJson = () => {
    if (!activeCanvas) return;
    const blob = new Blob([JSON.stringify(activeCanvas, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCanvas.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-hierarchy.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteCanvas = async (canvasId: string) => {
    await deleteCanvas(canvasId);
    const remaining = canvases.filter((c) => c.id !== canvasId);
    setCanvases(remaining);
    if (remaining.length > 0) {
      selectCanvas(remaining[0]);
    } else {
      setActiveCanvas(null);
      setNodes([]);
      setEdges([]);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden bg-[var(--bg-primary)]">
      {/* Top Navbar Header */}
      <header className="h-16 border-b border-[var(--border-light)] bg-[var(--card-bg)]/80 backdrop-blur-xl px-5 flex items-center justify-between z-10 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-bg)] border border-[var(--border-light)] flex items-center justify-center text-[var(--accent)] shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-[var(--text-primary)]">
                CorpCanvas
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent)]/30">
                Multi-Source
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Corporate Lineage, Brand Assets & Regulatory Hierarchy
            </p>
          </div>
        </div>

        {/* Canvas Switcher Dropdown */}
        <div className="flex items-center gap-2">
          {canvases.length > 0 && (
            <select
              value={activeCanvas?.id || ''}
              onChange={(e) => {
                const found = canvases.find((c) => c.id === e.target.value);
                if (found) selectCanvas(found);
              }}
              className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-light)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              {canvases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.source.toUpperCase()})
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-95 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Search & Import</span>
          </button>

          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            title="Appearance Settings"
          >
            <Palette className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Toolbar Controls */}
      <div className="absolute top-20 left-6 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--card-bg)]/85 backdrop-blur-xl border border-[var(--border-light)] shadow-xl">
        <button
          type="button"
          onClick={() => handleAutoLayout('LR')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            layoutDirection === 'LR'
              ? 'bg-[var(--accent)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
          }`}
          title="Horizontal Layout (Left-to-Right)"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>Horizontal</span>
        </button>

        <button
          type="button"
          onClick={() => handleAutoLayout('TB')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            layoutDirection === 'TB'
              ? 'bg-[var(--accent)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
          }`}
          title="Vertical Layout (Top-to-Bottom)"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Vertical</span>
        </button>

        <div className="w-px h-4 bg-[var(--border-light)] my-auto" />

        <button
          type="button"
          onClick={() => reactFlowInstance?.fitView({ padding: 0.2, duration: 400 })}
          className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          title="Fit to View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleExportJson}
          className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          title="Export JSON"
        >
          <Download className="w-4 h-4" />
        </button>

        {activeCanvas && canvases.length > 1 && (
          <button
            type="button"
            onClick={() => handleDeleteCanvas(activeCanvas.id)}
            className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors"
            title="Delete Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main React Flow Canvas Area */}
      <main className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.15}
          maxZoom={2.5}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { stroke: 'var(--accent)', strokeWidth: 1.5 }
          }}
          className="bg-[var(--bg-primary)]"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color="var(--border)"
          />
          <Controls
            className="!bg-[var(--card-bg)] !border !border-[var(--border-light)] !rounded-2xl !overflow-hidden !shadow-xl [&>button]:!bg-transparent [&>button]:!border-b [&>button]:!border-[var(--border-light)] [&>button]:!text-[var(--text-primary)]"
          />
          <MiniMap
            nodeStrokeWidth={3}
            nodeColor="var(--accent)"
            maskColor="rgba(0, 0, 0, 0.6)"
            className="!bg-[var(--card-bg)] !border !border-[var(--border-light)] !rounded-2xl !overflow-hidden !shadow-xl !bottom-5 !right-5"
          />
        </ReactFlow>
      </main>

      {/* Search & Import Modal */}
      <CompanySearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onImportToCanvas={handleImportToCanvas}
      />

      {/* Node Detail Inspector Modal */}
      <CompanyDetailModal
        nodeData={inspectedNode}
        onClose={() => setInspectedNode(null)}
      />

      {/* Theme Customizer Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </div>
  );
};
