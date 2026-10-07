import React, { useState, useEffect } from 'react';
import {
  X,
  Palette,
  RotateCcw,
  Check,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import {
  THEME_PRESETS,
  getActivePreset,
  setActivePreset,
  applyPresetPaletteForMode,
  applyCustomThemeProperties,
  clearCustomThemeProperties,
  THEME_KEY,
  safeStorage
} from '../styles/theme';
import type { ThemeMode } from '../types/theme';

export interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChanged?: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  onThemeChanged
}) => {
  const [activePresetId, setActivePresetId] = useState<string>('default');
  const [currentMode, setCurrentMode] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColor] = useState<string>('#0a84ff');

  useEffect(() => {
    if (!isOpen) return;
    const mode = (document.documentElement.getAttribute('data-theme') || 'dark') as ThemeMode;
    setCurrentMode(mode);
    const active = getActivePreset();
    setActivePresetId(active.id);
    const computedAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    if (computedAccent) setAccentColor(computedAccent);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleModeToggle = (mode: ThemeMode) => {
    setCurrentMode(mode);
    document.documentElement.setAttribute('data-theme', mode);
    safeStorage.setItem(THEME_KEY, mode);
    applyPresetPaletteForMode(activePresetId, mode);
    onThemeChanged?.();
  };

  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    setActivePreset(presetId);
    onThemeChanged?.();
  };

  const handleAccentChange = (hex: string) => {
    setAccentColor(hex);
    applyCustomThemeProperties({
      '--accent': hex,
      '--accent-hover': hex,
      '--accent-bg': `${hex}22`,
      '--tag-text': hex
    });
    onThemeChanged?.();
  };

  const handleReset = () => {
    clearCustomThemeProperties();
    setActivePresetId('default');
    setActivePreset('default');
    setAccentColor('#0a84ff');
    onThemeChanged?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[var(--card-bg)] border border-[var(--border-light)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-light)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Theme & Appearance
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Customize glassmorphic styling, dark/light modes & preset palettes
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

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-5">
          {/* Light / Dark Mode Switch */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Display Mode
            </label>
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-light)] gap-1">
              <button
                type="button"
                onClick={() => handleModeToggle('dark')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  currentMode === 'dark'
                    ? 'bg-[var(--card-bg)] text-[var(--accent)] shadow-sm border border-[var(--border-light)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Obsidian Dark</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeToggle('light')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  currentMode === 'light'
                    ? 'bg-[var(--card-bg)] text-[var(--accent)] shadow-sm border border-[var(--border-light)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Porcelain Light</span>
              </button>
            </div>
          </div>

          {/* Curated Presets */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Curated Theme Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {THEME_PRESETS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                const swatches = currentMode === 'dark' ? preset.swatches.dark : preset.swatches.light;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30 bg-[var(--bg-secondary)]'
                        : 'border-[var(--border-light)] bg-[var(--bg-primary)] hover:border-[var(--accent)]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {preset.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent)]" />}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                      {preset.desc}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      {swatches.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Accent Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Primary Accent Color
            </label>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-light)]">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => handleAccentChange(e.target.value)}
                className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
              />
              <span className="font-mono text-xs text-[var(--text-secondary)] uppercase">
                {accentColor}
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                {['#0a84ff', '#38bdf8', '#ec4899', '#10b981', '#f97316', '#88c0d0'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleAccentChange(color)}
                    className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-light)] flex items-center justify-between bg-[var(--card-bg)]">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
