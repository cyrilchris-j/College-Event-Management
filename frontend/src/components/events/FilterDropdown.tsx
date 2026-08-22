import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import type { EventCategory, SortOption } from '@/types';

const CATEGORIES: Array<EventCategory | 'All'> = [
  'All',
  'Technical',
  'Hackathon',
  'Workshop',
  'Seminar',
  'Cultural',
  'Exhibition',
];

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: EventCategory | 'All';
  onCategoryChange: (cat: EventCategory | 'All') => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export function FilterDropdown({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  selectedSort: _selectedSort,
  onSortChange: _onSortChange,
  onClear,
  hasActiveFilters,
  anchorRef,
}: FilterDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose, anchorRef]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Filter events"
      className="absolute z-30 right-0 top-full mt-2 w-72 bg-white rounded-xl border border-border shadow-card-hover
                 animate-fade-up"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold text-navy">Filter Events</span>
        <button
          onClick={onClose}
          aria-label="Close filter panel"
          className="p-1 rounded text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Category */}
        <fieldset>
          <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Category
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700',
                ].join(' ')}
                aria-pressed={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </fieldset>


      </div>

      {hasActiveFilters && (
        <div className="px-4 pb-4">
          <button
            onClick={() => { onClear(); onClose(); }}
            className="w-full text-xs font-medium text-blue-600 hover:text-blue-700
                       bg-blue-50 hover:bg-blue-100 rounded-lg py-2 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
