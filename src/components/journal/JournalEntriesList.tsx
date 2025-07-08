
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, BookText, Search, Filter, Calendar, Tag } from "lucide-react";
import { motion } from "framer-motion";
import JournalEntryCard from "./JournalEntryCard";

interface JournalEntriesListProps {
  entries: JournalEntry[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onEditEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onNewEntry: () => void;
}

const JournalEntriesList: React.FC<JournalEntriesListProps> = ({
  entries,
  activeTab,
  onTabChange,
  onEditEntry,
  onDeleteEntry,
  onNewEntry
}) => {
  const filterOptions = [
    { value: "all", label: "All Entries", icon: BookText },
    { value: "today", label: "Today", icon: Calendar },
    { value: "week", label: "This Week", icon: Calendar },
    { value: "month", label: "This Month", icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookText className="h-6 w-6 text-primary" />
            Journal Entries
          </h2>
          <p className="text-slate-400 mt-1">Browse and explore your thoughts</p>
        </div>
        <Button
          onClick={onNewEntry}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search journal entries..."
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20"
                />
              </div>
              
              {/* Filter Buttons */}
              <div className="flex gap-2">
                {filterOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={activeTab === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onTabChange(option.value)}
                    className={`${
                      activeTab === option.value
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <option.icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Entries List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-6">
            <div className="space-y-4">
              {entries.length > 0 ? (
                entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <JournalEntryCard
                      entry={entry}
                      onEdit={onEditEntry}
                      onDelete={onDeleteEntry}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
                    <BookText className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No entries found</h3>
                  <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    {activeTab === "all" 
                      ? "Start your journaling journey by creating your first entry." 
                      : "No entries match your current filter. Try adjusting your search or create a new entry."
                    }
                  </p>
                  <Button
                    onClick={onNewEntry}
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Entry
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Footer */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="flex gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <BookText className="h-4 w-4" />
              <span>{entries.length} entries</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>{new Set(entries.flatMap(e => e.tags)).size} unique tags</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default JournalEntriesList;
