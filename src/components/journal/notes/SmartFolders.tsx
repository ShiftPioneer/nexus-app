import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Folder, 
  FolderPlus, 
  Settings, 
  Hash, 
  Calendar, 
  Star, 
  Archive, 
  Trash2,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Edit,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SmartFolder {
  id: string;
  name: string;
  type: 'folder' | 'smart';
  color: string;
  icon: string;
  noteCount: number;
  filters?: {
    tags?: string[];
    dateRange?: string;
    contentType?: string;
    hasMedia?: boolean;
  };
  isExpanded?: boolean;
  parentId?: string;
}

interface SmartFoldersProps {
  folders: SmartFolder[];
  selectedFolder: string;
  onFolderSelect: (folderId: string) => void;
  onFolderCreate: (folder: Omit<SmartFolder, 'id' | 'noteCount'>) => void;
  onFolderUpdate: (folderId: string, updates: Partial<SmartFolder>) => void;
  onFolderDelete: (folderId: string) => void;
  className?: string;
}

const SmartFolders = ({
  folders,
  selectedFolder,
  onFolderSelect,
  onFolderCreate,
  onFolderUpdate,
  onFolderDelete,
  className
}: SmartFoldersProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("blue");

  const colors = [
    { name: 'blue', class: 'bg-primary/80', light: 'bg-primary/10 text-primary' },
    { name: 'green', class: 'bg-success/80', light: 'bg-success/10 text-success' },
    { name: 'purple', class: 'bg-purple-500/80', light: 'bg-purple-500/10 text-purple-400' },
    { name: 'orange', class: 'bg-primary', light: 'bg-primary/10 text-primary' },
    { name: 'pink', class: 'bg-pink-500/80', light: 'bg-pink-500/10 text-pink-400' },
    { name: 'indigo', class: 'bg-indigo-500/80', light: 'bg-indigo-500/10 text-indigo-400' },
  ];

  const getColorClass = (color: string, type: 'dot' | 'badge' = 'dot') => {
    const colorObj = colors.find(c => c.name === color);
    return type === 'dot' ? colorObj?.class : colorObj?.light;
  };

  const createFolder = useCallback(() => {
    if (!newFolderName.trim()) return;
    
    onFolderCreate({
      name: newFolderName,
      type: 'folder',
      color: newFolderColor,
      icon: 'folder'
    });
    
    setNewFolderName("");
    setIsCreating(false);
    toast.success("Folder created");
  }, [newFolderName, newFolderColor, onFolderCreate]);

  const toggleFolder = useCallback((folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      onFolderUpdate(folderId, { isExpanded: !folder.isExpanded });
    }
  }, [folders, onFolderUpdate]);

  const getSmartFolders = () => {
    return [
      {
        id: 'all',
        name: 'All Notes',
        type: 'smart' as const,
        color: 'blue',
        icon: 'folder',
        noteCount: folders.reduce((sum, f) => sum + f.noteCount, 0)
      },
      {
        id: 'recent',
        name: 'Recently Added',
        type: 'smart' as const,
        color: 'green',
        icon: 'calendar',
        noteCount: 0 // This would be calculated based on date filters
      },
      {
        id: 'favorites',
        name: 'Favorites',
        type: 'smart' as const,
        color: 'orange',
        icon: 'star',
        noteCount: 0 // This would be calculated based on starred notes
      },
      {
        id: 'media',
        name: 'Notes with Media',
        type: 'smart' as const,
        color: 'purple',
        icon: 'image',
        noteCount: 0 // This would be calculated based on media presence
      },
      {
        id: 'archived',
        name: 'Archived',
        type: 'smart' as const,
        color: 'gray',
        icon: 'archive',
        noteCount: 0
      }
    ];
  };

  const renderFolder = (folder: SmartFolder) => {
    const isSelected = selectedFolder === folder.id;
    const isEditing = editingId === folder.id;
    const hasChildren = folders.some(f => f.parentId === folder.id);
    
    return (
      <motion.div
        key={folder.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-1"
      >
        <div
          className={cn(
            "group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200",
            isSelected
              ? "bg-primary/20 text-primary border border-primary/30"
              : "hover:bg-card/60 text-foreground hover:text-primary"
          )}
          onClick={() => onFolderSelect(folder.id)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
            >
              {folder.isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
          <div className={cn("w-2 h-2 rounded-full", getColorClass(folder.color))} />
          
          {isEditing ? (
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onFolderUpdate(folder.id, { name: newFolderName });
                  setEditingId(null);
                  setNewFolderName("");
                }
                if (e.key === 'Escape') {
                  setEditingId(null);
                  setNewFolderName("");
                }
              }}
              className="h-6 text-sm border-none bg-transparent p-0 focus-visible:ring-1"
              autoFocus
            />
          ) : (
            <span className="text-sm font-medium truncate flex-1">{folder.name}</span>
          )}
          
          <Badge 
            variant="secondary" 
            className="text-xs bg-card/50 hover:bg-card/80 transition-colors"
          >
            {folder.noteCount}
          </Badge>
          
          {folder.type === 'folder' && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(folder.id);
                  setNewFolderName(folder.name);
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onFolderDelete(folder.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Child folders */}
        <AnimatePresence>
          {folder.isExpanded && hasChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ml-6 space-y-1"
            >
              {folders
                .filter(f => f.parentId === folder.id)
                .map(renderFolder)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search folders..."
            className="pl-10 glass border-border/50"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="hover:bg-primary/10"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Create New Folder */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-3 glass">
              <div className="space-y-3">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') createFolder();
                    if (e.key === 'Escape') setIsCreating(false);
                  }}
                  autoFocus
                />
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Color:</span>
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setNewFolderColor(color.name)}
                      className={cn(
                        "w-4 h-4 rounded-full transition-transform hover:scale-110",
                        color.class,
                        newFolderColor === color.name && "ring-2 ring-primary ring-offset-2"
                      )}
                    />
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={createFolder} size="sm" className="btn-primary">
                    Create
                  </Button>
                  <Button onClick={() => setIsCreating(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Folders */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Smart Folders
        </h4>
        {getSmartFolders().map(renderFolder)}
      </div>

      {/* Custom Folders */}
      {folders.filter(f => !f.parentId).length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            My Folders
          </h4>
          {folders
            .filter(f => !f.parentId)
            .map(renderFolder)}
        </div>
      )}
    </div>
  );
};

export default SmartFolders;