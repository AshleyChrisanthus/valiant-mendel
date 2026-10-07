import React, { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import {
  Building2,
  FileText,
  Sparkles,
  ExternalLink,
  Trash2,
  Globe2,
  Layers,
  ChevronRight
} from 'lucide-react';
import type { CanvasNodeData, CompanySource } from '../../types/company';

export type CompanyNodeType = Node<
  CanvasNodeData & {
    onInspect?: (data: CanvasNodeData) => void;
    onDelete?: (nodeId: string) => void;
    onExpand?: (nodeId: string) => void;
  },
  'companyNode'
>;

export type CompanyNodeProps = NodeProps<CompanyNodeType>;

const sourceConfig: Record<
  CompanySource,
  { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }
> = {
  wikidata: {
    label: 'Wikidata Asset',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400 border-emerald-500/30',
    icon: Sparkles
  },
  gleif: {
    label: 'GLEIF Verified',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400 border-blue-500/30',
    icon: Building2
  },
  sec: {
    label: 'SEC 10-K',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400 border-amber-500/30',
    icon: FileText
  }
};

export const CompanyNode = memo(({ id, data, selected }: CompanyNodeProps) => {
  const source = data.source || 'wikidata';
  const config = sourceConfig[source] || sourceConfig.wikidata;
  const SourceIcon = config.icon;

  const onInspect = data.onInspect as ((data: CanvasNodeData) => void) | undefined;
  const onDelete = data.onDelete as ((nodeId: string) => void) | undefined;
  const onExpand = data.onExpand as ((nodeId: string) => void) | undefined;

  return (
    <div
      className={`group relative w-72 rounded-2xl bg-[var(--card-bg)] border transition-all duration-200 select-none shadow-xl ${
        selected
          ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30 scale-102'
          : 'border-[var(--border-light)] hover:border-[var(--accent)]/60'
      }`}
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
    >
      {/* React Flow Connector Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="!w-3 !h-3 !bg-[var(--accent)] !border-2 !border-[var(--bg-primary)] opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="!w-3 !h-3 !bg-[var(--accent)] !border-2 !border-[var(--bg-primary)] opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="!w-3 !h-3 !bg-[var(--accent)] !border-2 !border-[var(--bg-primary)] opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="!w-3 !h-3 !bg-[var(--accent)] !border-2 !border-[var(--bg-primary)] opacity-0 group-hover:opacity-100 transition-opacity"
      />

      {/* Main Node Card Body */}
      <div className="p-3.5 flex flex-col gap-2.5">
        {/* Top Header Row: Source Badge & Jurisdiction */}
        <div className="flex items-center justify-between gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${config.bg} ${config.text}`}
          >
            <SourceIcon className="w-3 h-3" />
            {config.label}
          </span>

          <div className="flex items-center gap-1">
            {data.jurisdiction && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-light)]">
                <Globe2 className="w-2.5 h-2.5" />
                {data.jurisdiction}
              </span>
            )}
            {data.childrenCount ? (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                <Layers className="w-2.5 h-2.5" />
                {data.childrenCount}
              </span>
            ) : null}
          </div>
        </div>

        {/* Middle Content Row: Logo/Icon & Title */}
        <div className="flex items-start gap-3">
          {/* Logo or source icon fallback */}
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt={data.title}
                className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <SourceIcon className="w-6 h-6 text-[var(--accent)] opacity-80" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4
              className="text-sm font-bold text-[var(--text-primary)] truncate leading-tight tracking-tight"
              title={data.title}
            >
              {data.title}
            </h4>
            <p className="text-[11px] text-[var(--text-secondary)] font-medium truncate mt-0.5">
              {data.badge || data.relationType || 'Entity'}
            </p>
            {data.lei && (
              <p className="text-[10px] font-mono text-[var(--text-tertiary)] truncate mt-0.5">
                LEI: {data.lei}
              </p>
            )}
            {data.cik && (
              <p className="text-[10px] font-mono text-[var(--text-tertiary)] truncate mt-0.5">
                CIK: {data.cik}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions Row */}
        <div className="pt-2 border-t border-[var(--border-light)] flex items-center justify-between">
          <div className="flex items-center gap-1">
            {data.hasChildren && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand?.(id);
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--accent-bg)] text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
                title="Expand Children"
              >
                <span>Branch</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInspect?.(data);
              }}
              className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              title="Inspect Details"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(id);
              }}
              className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors"
              title="Delete Node"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

CompanyNode.displayName = 'CompanyNode';
