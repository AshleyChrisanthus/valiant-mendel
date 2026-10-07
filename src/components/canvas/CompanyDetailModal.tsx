import React from 'react';
import {
  X,
  ExternalLink,
  Building2,
  Sparkles,
  FileText,
  Globe2,
  Calendar,
  Layers,
  Copy
} from 'lucide-react';
import type { CanvasNodeData } from '../../types/company';

export interface CompanyDetailModalProps {
  nodeData: CanvasNodeData | null;
  onClose: () => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ nodeData, onClose }) => {
  if (!nodeData) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[var(--card-bg)] border border-[var(--border-light)] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-light)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-light)] flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              {nodeData.logoUrl ? (
                <img
                  src={nodeData.logoUrl}
                  alt={nodeData.title}
                  className="w-full h-full object-contain p-1"
                />
              ) : nodeData.source === 'gleif' ? (
                <Building2 className="w-6 h-6 text-[var(--accent)]" />
              ) : nodeData.source === 'sec' ? (
                <FileText className="w-6 h-6 text-[var(--accent)]" />
              ) : (
                <Sparkles className="w-6 h-6 text-[var(--accent)]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] leading-tight">
                {nodeData.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {nodeData.badge || nodeData.relationType || 'Entity'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {nodeData.description && (
            <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-light)] leading-relaxed text-[var(--text-secondary)]">
              {nodeData.description}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-light)] flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Source
              </span>
              <span className="font-semibold text-[var(--text-primary)] capitalize">
                {nodeData.source === 'wikidata' ? 'Wikidata Graph' : nodeData.source === 'gleif' ? 'GLEIF Index' : 'SEC EDGAR 10-K'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-light)] flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Relationship
              </span>
              <span className="font-semibold text-[var(--text-primary)]">
                {nodeData.relationType || 'Subsidiary'}
              </span>
            </div>

            {nodeData.jurisdiction && (
              <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-light)] flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  Jurisdiction
                </span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {nodeData.jurisdiction}
                </span>
              </div>
            )}

            {nodeData.lei && (
              <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-light)] flex flex-col gap-1 col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    LEI (Legal Entity Identifier)
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(nodeData.lei || '')}
                    className="text-[10px] text-[var(--accent)] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-2.5 h-2.5" />
                    Copy
                  </button>
                </div>
                <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                  {nodeData.lei}
                </span>
              </div>
            )}

            {nodeData.cik && (
              <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-light)] flex flex-col gap-1 col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    SEC CIK
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(nodeData.cik || '')}
                    className="text-[10px] text-[var(--accent)] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-2.5 h-2.5" />
                    Copy
                  </button>
                </div>
                <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                  {nodeData.cik}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-light)] flex justify-end bg-[var(--card-bg)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
