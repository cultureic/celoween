"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterState } from "./types";

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories: string[];
  showMobileFilters?: boolean;
  onToggleMobileFilters?: () => void;
}

export function FiltersSimple({ 
  filters, 
  onChange, 
  categories, 
  showMobileFilters = false,
  onToggleMobileFilters 
}: FiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.q);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.q) {
        onChange({ ...filters, q: searchQuery });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, onChange]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    const clearedFilters = { q: "", level: "Todos" as const, category: "All", sort: "Más Popular" as const };
    setSearchQuery("");
    onChange(clearedFilters);
  };

  const hasActiveFilters = filters.q || filters.level !== "Todos" || filters.category !== "All";

  return (
    <div className="space-y-4">
      {/* Mobile filter toggle */}
      <div className="lg:hidden flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleMobileFilters}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Filter controls */}
      <div className={`space-y-4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter controls grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Level filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Level</label>
            <Select value={filters.level} onValueChange={(value) => handleFilterChange("level", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Sort by</label>
            <Select value={filters.sort} onValueChange={(value) => handleFilterChange("sort", value as FilterState["sort"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Most Popular">Most Popular</SelectItem>
                <SelectItem value="Highest Rated">Highest Rated</SelectItem>
                <SelectItem value="Newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

