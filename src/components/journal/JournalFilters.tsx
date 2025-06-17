
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface JournalFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const JournalFilters: React.FC<JournalFiltersProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="all">All Entries</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search journal entries..."
            className="pl-8 bg-slate-900 text-white placeholder:text-slate-400 border-slate-300"
          />
        </div>
      </div>
    </div>
  );
};

export default JournalFilters;
