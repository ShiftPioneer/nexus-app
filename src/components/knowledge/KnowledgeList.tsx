
import React, { useState } from "react";
import { KnowledgeEntry } from "@/types/knowledge";
import { useKnowledge } from "@/contexts/KnowledgeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Edit, 
  ExternalLink, 
  FileText, 
  Inbox, 
  Link2, 
  MoreHorizontal, 
  Paperclip, 
  Trash2,
  Archive,
  FolderOpen,
  FileSpreadsheet,
  Send
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import EntryDialog from "./EntryDialog";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface KnowledgeListProps {
  entries: KnowledgeEntry[];
  showCategory?: boolean;
  showActions?: boolean;
  onSelect?: (entry: KnowledgeEntry) => void;
}

const KnowledgeList: React.FC<KnowledgeListProps> = ({ 
  entries, 
  showCategory = true,
  showActions = true,
  onSelect 
}) => {
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
  const { deleteEntry, moveEntry, getLinkedTasks } = useKnowledge();
  
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Move the entry to the new category
    moveEntry(draggableId, destination.droppableId as any);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "inbox": return <Inbox className="h-4 w-4" />;
      case "projects": return <FileSpreadsheet className="h-4 w-4" />;
      case "areas": return <FolderOpen className="h-4 w-4" />;
      case "resources": return <FileText className="h-4 w-4" />;
      case "archives": return <Archive className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };
  
  const handleEditEntry = (entry: KnowledgeEntry) => {
    setSelectedEntry(entry);
  };

  const handleMoveEntry = (entry: KnowledgeEntry, category: any) => {
    moveEntry(entry.id, category);
  };

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
  };
  
  const handleSelect = (entry: KnowledgeEntry) => {
    if (onSelect) {
      onSelect(entry);
    } else {
      setSelectedEntry(entry);
    }
  };
  
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No entries found</h3>
          <p className="text-muted-foreground mt-2 text-center">
            Try adjusting your filters or search query, or add a new knowledge entry.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Entries ({entries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.map(entry => (
              <Draggable key={entry.id} draggableId={entry.id} index={parseInt(entry.id)}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`
                      border rounded-lg p-4 transition-all cursor-pointer 
                      ${snapshot.isDragging ? 'shadow-md bg-muted/50' : 'bg-card hover:border-primary/30'}
                    `}
                    onClick={() => handleSelect(entry)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{entry.title}</h3>
                        {showCategory && (
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            {getCategoryIcon(entry.category)}
                            <span className="ml-1 capitalize">{entry.category}</span>
                          </div>
                        )}
                        <p className="line-clamp-2 text-sm text-muted-foreground mt-2">
                          {entry.content}
                        </p>
                        
                        {/* Metadata */}
                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                          {entry.linkedTaskIds && entry.linkedTaskIds.length > 0 && (
                            <div className="flex items-center">
                              <Link2 className="h-3 w-3 mr-1" />
                              {entry.linkedTaskIds.length} task{entry.linkedTaskIds.length !== 1 && 's'}
                            </div>
                          )}
                          
                          {entry.url && (
                            <div className="flex items-center">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              URL
                            </div>
                          )}
                          
                          {entry.fileAttachment && (
                            <div className="flex items-center">
                              <Paperclip className="h-3 w-3 mr-1" />
                              {entry.fileAttachment.name}
                            </div>
                          )}
                          
                          <div className="flex items-center ml-auto">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(entry.updatedAt), { addSuffix: true })}
                          </div>
                        </div>
                        
                        {/* Tags */}
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {entry.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      {showActions && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEditEntry(entry);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {entry.category !== "inbox" && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleMoveEntry(entry, "inbox");
                              }}>
                                <Inbox className="h-4 w-4 mr-2" />
                                Move to Inbox
                              </DropdownMenuItem>
                            )}
                            {entry.category !== "projects" && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleMoveEntry(entry, "projects");
                              }}>
                                <FileSpreadsheet className="h-4 w-4 mr-2" />
                                Move to Projects
                              </DropdownMenuItem>
                            )}
                            {entry.category !== "areas" && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleMoveEntry(entry, "areas");
                              }}>
                                <FolderOpen className="h-4 w-4 mr-2" />
                                Move to Areas
                              </DropdownMenuItem>
                            )}
                            {entry.category !== "resources" && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleMoveEntry(entry, "resources");
                              }}>
                                <FileText className="h-4 w-4 mr-2" />
                                Move to Resources
                              </DropdownMenuItem>
                            )}
                            {entry.category !== "archives" && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleMoveEntry(entry, "archives");
                              }}>
                                <Archive className="h-4 w-4 mr-2" />
                                Move to Archives
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEntry(entry.id);
                            }}
                            className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Entry dialog for viewing/editing */}
      {selectedEntry && (
        <EntryDialog 
          entry={selectedEntry} 
          isOpen={!!selectedEntry} 
          onClose={() => setSelectedEntry(null)} 
        />
      )}
    </DragDropContext>
  );
};

export default KnowledgeList;
