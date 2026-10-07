import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Building2,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Layers,
  Globe2,
  Info
} from 'lucide-react';
import type { CompanySource, UnifiedCompanyData } from '../../types/company';
import { searchCorporateHierarchy } from '../../services/companyApi';

export interface CompanySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportToCanvas: (data: UnifiedCompanyData) => void;
}

const sourceDescriptions: Record<
  CompanySource,
  { title: string; subtitle: string; tip: string; icon: React.ComponentType<{ className?: string }> }
> = {
  wikidata: {
    title: 'Brands, Studios & Assets',
    subtitle: 'Wikidata Knowledge Graph',
    tip: 'Wikidata includes recognizable consumer brands, entertainment studios, and logos (e.g. Disney, Marvel, Pixar, Alphabet, YouTube, Skydance).',
    icon: Sparkles
  },
  gleif: {
    title: 'Global Legal Entities',
    subtitle: 'GLEIF Level 2 Lineage',
    tip: 'GLEIF provides verified international legal entities, LEIs, jurisdictions of incorporation, and direct/ultimate accounting parents.',
    icon: Building2
  },
  sec: {
    title: 'SEC Filings (10-K)',
    subtitle: 'Exhibit 21 Significant Subsidiaries',
    tip: 'Returns legally audited significant subsidiaries and state of incorporation from annual 10-K filings for US public companies.',
    icon: FileText
  }
};

export const CompanySearchModal: React.FC<CompanySearchModalProps> = ({
  isOpen,
  onClose,
  onImportToCanvas
}) => {
  const [selectedSource, setSelectedSource] = useState<CompanySource>('wikidata');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<UnifiedCompanyData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentDesc = sourceDescriptions[selectedSource];
  const SourceIcon = currentDesc.icon;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await searchCorporateHierarchy(selectedSource, searchQuery.trim());
      setPreviewResult(data);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to search company hierarchy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (!previewResult) return;
    onImportToCanvas(previewResult);
    onClose();
  };

  const handleQuickPreset = (name: string) => {
    setSearchQuery(name);
    setIsLoading(true);
    setErrorMsg('');
    searchCorporateHierarchy(selectedSource, name)
      .then((data) => {
        setPreviewResult(data);
      })
      .catch((err) => {
        setErrorMsg(err?.message || 'Failed to search');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[var(--card-bg)] border border-[var(--border-light)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-light)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Import Company Hierarchy
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Explore brand architectures, legal entities & regulatory subsidiaries
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

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-5">
          {/* 1. Source Segmented Control */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Select Free Data Source
            </label>
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-light)] gap-1">
              {(['wikidata', 'gleif', 'sec'] as CompanySource[]).map((src) => {
                const isSelected = selectedSource === src;
                const Icon = sourceDescriptions[src].icon;
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => {
                      setSelectedSource(src);
                      setPreviewResult(null);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[var(--card-bg)] text-[var(--accent)] shadow-md font-bold border border-[var(--border-light)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{src === 'wikidata' ? 'Wikidata' : src === 'gleif' ? 'GLEIF API' : 'SEC 10-K'}</span>
                  </button>
                );
              })}
            </div>

            {/* Source Context Banner */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-xs text-[var(--text-secondary)]">
              <Info className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[var(--text-primary)] block mb-0.5">
                  {currentDesc.title} — {currentDesc.subtitle}
                </span>
                <p className="leading-relaxed">{currentDesc.tip}</p>
              </div>
            </div>
          </div>

          {/* 2. Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  selectedSource === 'wikidata'
                    ? 'Search company (e.g. Disney, Alphabet, Skydance)...'
                    : selectedSource === 'gleif'
                    ? 'Search legal entity or 20-digit LEI (e.g. Disney, 549300V5Q8D38U6M2T35)...'
                    : 'Search company ticker or CIK (e.g. Disney, DIS, Alphabet, 0001744489)...'
                }
                className="w-full pl-10 pr-24 py-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-light)] text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
              />
              <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-3.5" />
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="absolute right-2 top-2 px-3.5 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Lookup</span>}
              </button>
            </div>

            {/* Quick Demo Previews */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-[var(--text-tertiary)]">Quick examples:</span>
              {['Disney', 'Alphabet', 'Skydance'].map((demo) => (
                <button
                  key={demo}
                  type="button"
                  onClick={() => handleQuickPreset(demo)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-light)] transition-colors"
                >
                  {demo}
                </button>
              ))}
            </div>
          </form>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-[var(--danger)]/15 border border-[var(--danger)]/30 text-xs text-[var(--danger)]">
              {errorMsg}
            </div>
          )}

          {/* 3. Search Result Preview */}
          {previewResult && (
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-light)] flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--card-bg)] border border-[var(--border-light)] flex items-center justify-center overflow-hidden shrink-0">
                    {previewResult.logoUrl ? (
                      <img
                        src={previewResult.logoUrl}
                        alt={previewResult.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <SourceIcon className="w-6 h-6 text-[var(--accent)]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">
                      {previewResult.name}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {previewResult.badge || previewResult.description}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready
                </span>
              </div>

              {/* Hierarchy stats */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-light)] text-xs">
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>
                    Discovered Nodes:{' '}
                    <strong className="text-[var(--text-primary)]">
                      {(previewResult.subsidiaries?.length || 0) + 1}
                    </strong>
                  </span>
                </div>
                {previewResult.jurisdiction && (
                  <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                    <Globe2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>
                      Jurisdiction:{' '}
                      <strong className="text-[var(--text-primary)]">
                        {previewResult.jurisdiction}
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Subsidiary Pills */}
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pt-1">
                {previewResult.subsidiaries?.map((sub) => (
                  <span
                    key={sub.id}
                    className="px-2 py-0.5 rounded-md text-[11px] bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-light)]"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border-light)] flex items-center justify-end gap-2.5 bg-[var(--card-bg)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!previewResult}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold shadow-lg hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            <span>Import to Canvas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
