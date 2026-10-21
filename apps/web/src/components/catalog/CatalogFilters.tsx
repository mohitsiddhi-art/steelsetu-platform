'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { CatalogSort, SteelCategoryMeta } from '@/types/steel';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface CatalogFiltersProps {
  categories: SteelCategoryMeta[];
  brands: string[];
  activeCategory?: string;
  activeBrand?: string;
  activeSearch?: string;
  activeSort?: string;
  resultCount: number;
}

const SORT_OPTIONS: Array<{ value: CatalogSort; label: string }> = [
  { value: 'name_asc', label: 'Name (A–Z)' },
  { value: 'price_asc', label: 'Rate: Low → High' },
  { value: 'price_desc', label: 'Rate: High → Low' },
  { value: 'stock_desc', label: 'Stock: High → Low' },
];

export default function CatalogFilters({
  categories,
  brands,
  activeCategory,
  activeBrand,
  activeSearch,
  activeSort,
  resultCount,
}: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [term, setTerm] = useState(activeSearch ?? '');
  const [showFilters, setShowFilters] = useState(false);

  // Keep the input in sync when the URL changes (back/forward, link clicks).
  useEffect(() => {
    setTerm(activeSearch ?? '');
  }, [activeSearch]);

  const applyParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      params.delete('page');
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `/products?${qs}` : '/products');
      });
    },
    [router, searchParams]
  );

  const submitSearch = (value: string) => {
    applyParams((p) => {
      if (value.trim()) p.set('q', value.trim());
      else p.delete('q');
    });
  };

  const setCategory = (code?: string) => {
    applyParams((p) => {
      if (code) p.set('category', code);
      else p.delete('category');
    });
  };

  const setBrand = (brand?: string) => {
    applyParams((p) => {
      if (brand) p.set('brand', brand);
      else p.delete('brand');
    });
  };

  const setSort = (sort: string) => {
    applyParams((p) => {
      if (sort && sort !== 'name_asc') p.set('sort', sort);
      else p.delete('sort');
    });
  };

  const clearAll = () => {
    startTransition(() => router.push('/products'));
  };

  const hasActiveFilters =
    Boolean(activeCategory) || Boolean(activeBrand) || Boolean(activeSearch);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch(term);
          }}
          className="relative flex-1 sm:max-w-sm"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search SKU, material, brand, grade..."
            aria-label="Search catalogue"
            className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white lg:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {hasActiveFilters && (
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" aria-hidden />
            )}
          </button>

          <label className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={activeSort ?? 'name_asc'}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {activeCategory && (
            <FilterChip
              label={
                categories.find((c) => c.code === activeCategory)?.label ?? activeCategory
              }
              onClear={() => setCategory(undefined)}
            />
          )}
          {activeBrand && <FilterChip label={activeBrand} onClear={() => setBrand(undefined)} />}
          {activeSearch && (
            <FilterChip label={`"${activeSearch}"`} onClear={() => submitSearch('')} />
          )}
          <button
            onClick={clearAll}
            className="text-[11px] text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
        <div className="grid gap-4 lg:grid-cols-[220px_200px_1fr]">
          {/* Category filter */}
          <div>
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Category
            </h3>
            <div className="space-y-0.5">
              <FilterOption
                label="All Categories"
                count={categories.reduce((acc, c) => acc + c.productCount, 0)}
                active={!activeCategory}
                onClick={() => setCategory(undefined)}
              />
              {categories.map((c) => (
                <FilterOption
                  key={c.code}
                  label={c.label}
                  count={c.productCount}
                  active={activeCategory === c.code}
                  onClick={() => setCategory(activeCategory === c.code ? undefined : c.code)}
                />
              ))}
            </div>
          </div>

          {/* Brand filter */}
          <div>
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Mill / Brand
            </h3>
            <div className="space-y-0.5">
              <FilterOption
                label="All Brands"
                active={!activeBrand}
                onClick={() => setBrand(undefined)}
              />
              {brands.map((b) => (
                <FilterOption
                  key={b}
                  label={b}
                  active={activeBrand === b}
                  onClick={() => setBrand(activeBrand === b ? undefined : b)}
                />
              ))}
            </div>
          </div>

          {/* Result count */}
          <div className="flex items-end justify-end lg:items-end">
            <p
              className={`text-xs text-slate-400 ${isPending ? 'opacity-50' : ''}`}
              aria-live="polite"
            >
              <span className="font-mono font-semibold text-white">{resultCount}</span>{' '}
              {resultCount === 1 ? 'product' : 'products'} listed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-800 bg-blue-950/50 px-2.5 py-1 text-[11px] font-medium text-blue-300">
      {label}
      <button
        onClick={onClear}
        aria-label={`Remove filter ${label}`}
        className="rounded-full p-0.5 transition-colors hover:bg-blue-900/60 hover:text-white"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function FilterOption({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors ${
        active
          ? 'bg-blue-600/15 font-medium text-blue-300'
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
      }`}
    >
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span className="shrink-0 font-mono text-[10px] text-slate-600">{count}</span>
      )}
    </button>
  );
}
