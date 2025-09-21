import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PlanningFiltersProps {
  filterType: 'goals' | 'projects';
  filters: GoalFilters | ProjectFilters;
  onFiltersChange: (filters: GoalFilters | ProjectFilters) => void;
  onClearFilters: () => void;
}

interface GoalFilters {
  category: string;
  timeframe: string;
  priority: string;
  status: string;
}

interface ProjectFilters {
  category: string;
  status: string;
}

const categories = [
  { value: 'wealth', label: 'Wealth & Finance', icon: '💰' },
  { value: 'health', label: 'Health & Fitness', icon: '🏃' },
  { value: 'relationships', label: 'Relationships', icon: '❤️' },
  { value: 'spirituality', label: 'Spirituality', icon: '🧘' },
  { value: 'education', label: 'Education & Learning', icon: '📚' },
  { value: 'career', label: 'Career & Business', icon: '💼' }
];

const timeframes = [
  { value: 'week', label: 'Weekly Goal' },
  { value: 'month', label: 'Monthly Goal' },
  { value: 'quarter', label: 'Quarterly Goal' },
  { value: 'year', label: 'Annual Goal' },
  { value: 'decade', label: 'Decade Goal' },
  { value: 'lifetime', label: 'Lifetime Goal' }
];

const priorities = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' }
];

const statuses = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
];

const PlanningFilters: React.FC<PlanningFiltersProps> = ({
  filterType,
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all');

  return (
    <Card className="p-4 mb-6 bg-slate-900/50 border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-white">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase tracking-wide">Category</label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all" className="text-white hover:bg-slate-700">
                All Categories
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-slate-700">
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timeframe Filter - Only for Goals */}
        {filterType === 'goals' && (
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wide">Timeframe</label>
            <Select
              value={(filters as GoalFilters).timeframe}
              onValueChange={(value) => handleFilterChange('timeframe', value)}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="All Timeframes" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">
                  All Timeframes
                </SelectItem>
                {timeframes.map((tf) => (
                  <SelectItem key={tf.value} value={tf.value} className="text-white hover:bg-slate-700">
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Priority Filter - Only for Goals */}
        {filterType === 'goals' && (
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wide">Priority</label>
            <Select
              value={(filters as GoalFilters).priority}
              onValueChange={(value) => handleFilterChange('priority', value)}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">
                  All Priorities
                </SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value} className="text-white hover:bg-slate-700">
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase tracking-wide">Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all" className="text-white hover:bg-slate-700">
                All Statuses
              </SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value} className="text-white hover:bg-slate-700">
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default PlanningFilters;