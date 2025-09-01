import React, { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  ChevronRight,
  Star,
  Archive,
  Trash2,
  Share,
  Lock,
  Pin,
  Hash,
  Settings,
  Users,
  Eye,
  Edit3,
  Palette,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import NotesToolbar from "./notes/NotesToolbar";
import RichTextEditor from "./notes/RichTextEditor";
import MediaUploader from "./notes/MediaUploader";
import SmartFolders from "./notes/SmartFolders";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  folder?: string;
  isPinned: boolean;
  isLocked: boolean;
  isArchived: boolean;
  isStarred: boolean;
  color?: string;
  mediaFiles: MediaFile[];
  collaborators: string[];
  version: number;
  mood?: 'positive' | 'negative' | 'neutral' | 'mixed';
}

interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
}

interface Folder {
  id: string;
  name: string;
  color: string;
  noteCount: number;
  type: 'folder' | 'smart';
  icon: string;
  filters?: {
    tags?: string[];
    dateRange?: string;
    contentType?: string;
    hasMedia?: boolean;
  };
  isExpanded?: boolean;
  parentId?: string;
}

const AppleNotesEditor = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [showCollaboration, setShowCollaboration] = useState(false);

  // Update folder counts
  useEffect(() => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === 'all') {
        return { ...folder, noteCount: notes.filter(n => !n.isArchived).length };
      }
      if (folder.id === 'recent') {
        const recentNotes = notes.filter(n => {
          const daysDiff = (new Date().getTime() - new Date(n.createdAt).getTime()) / (1000 * 3600 * 24);
          return daysDiff <= 7 && !n.isArchived;
        });
        return { ...folder, noteCount: recentNotes.length };
      }
      return { ...folder, noteCount: notes.filter(n => n.folder === folder.id && !n.isArchived).length };
    }));
  }, [notes]);

  const createNewNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      folder: selectedFolder === 'all' || selectedFolder === 'recent' ? undefined : selectedFolder,
      isPinned: false,
      isLocked: false,
      isArchived: false,
      isStarred: false,
      mediaFiles: [],
      collaborators: [],
      version: 1
    };

    setNotes(prev => [newNote, ...prev]);
    setCurrentNote(newNote);
    setIsEditing(true);
    toast.success("New note created");
  }, [selectedFolder]);

  const updateNote = useCallback((updates: Partial<Note>) => {
    if (!currentNote) return;

    const updatedNote = { 
      ...currentNote, 
      ...updates, 
      updatedAt: new Date(),
      version: currentNote.version + 1
    };
    setNotes(prev => prev.map(note => 
      note.id === currentNote.id ? updatedNote : note
    ));
    setCurrentNote(updatedNote);
  }, [currentNote]);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (currentNote?.id === noteId) {
      setCurrentNote(null);
      setIsEditing(false);
    }
    toast.success("Note deleted");
  }, [currentNote]);

  const togglePin = useCallback((noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ));
  }, []);

  const toggleStar = useCallback((noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, isStarred: !note.isStarred } : note
    ));
  }, []);

  // Rich text editor functions
  const handleFormat = useCallback((command: string, value?: string) => {
    if (!currentNote) return;
    
    try {
      document.execCommand(command, false, value);
    } catch (error) {
      console.warn('Format command failed:', command, error);
    }
  }, [currentNote]);

  const handleMediaUpload = useCallback((files: MediaFile[]) => {
    if (!currentNote) return;
    
    updateNote({ mediaFiles: [...currentNote.mediaFiles, ...files] });
    toast.success(`${files.length} file(s) added to note`);
  }, [currentNote, updateNote]);

  const handleFolderCreate = useCallback((folder: Omit<Folder, 'id' | 'noteCount'>) => {
    const newFolder: Folder = {
      ...folder,
      id: Date.now().toString(),
      noteCount: 0
    };
    setFolders(prev => [...prev, newFolder]);
  }, []);

  const handleFolderUpdate = useCallback((folderId: string, updates: Partial<Folder>) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId ? { ...folder, ...updates } : folder
    ));
  }, []);

  const handleFolderDelete = useCallback((folderId: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== folderId));
    // Move notes from deleted folder to 'all'
    setNotes(prev => prev.map(note => 
      note.folder === folderId ? { ...note, folder: undefined } : note
    ));
    toast.success("Folder deleted");
  }, []);

  const getFilteredNotes = useCallback(() => {
    let filtered = notes.filter(note => !note.isArchived);

    if (selectedFolder === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(note => new Date(note.createdAt) >= sevenDaysAgo);
    } else if (selectedFolder !== 'all') {
      filtered = filtered.filter(note => note.folder === selectedFolder);
    }

    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort: pinned notes first, then by update date
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, selectedFolder, searchQuery]);

  const getPreviewText = (content: string) => {
    return content.replace(/<[^>]*>/g, '').substring(0, 100) + (content.length > 100 ? '...' : '');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(date).toLocaleDateString();
  };

  const filteredNotes = getFilteredNotes();

  return (
    <div className="flex h-[calc(100vh-200px)] glass rounded-xl overflow-hidden border border-border/50">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="glass border-r border-border/50 flex flex-col bg-card/30"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Smart Notes</h2>
                <Button
                  onClick={createNewNote}
                  size="sm"
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass border-border/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Smart Folders */}
            <div className="flex-1 overflow-y-auto p-4">
              <SmartFolders
                folders={folders}
                selectedFolder={selectedFolder}
                onFolderSelect={setSelectedFolder}
                onFolderCreate={handleFolderCreate}
                onFolderUpdate={handleFolderUpdate}
                onFolderDelete={handleFolderDelete}
              />
            </div>

            {/* Notes List */}
            <div className="border-t border-border/50 p-4">
              <div className="space-y-2">
                <AnimatePresence>
                  {filteredNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-all duration-200 group relative glass",
                        currentNote?.id === note.id
                          ? "bg-primary/10 border border-primary/20 shadow-sm"
                          : "hover:bg-card/60"
                      )}
                      onClick={() => {
                        setCurrentNote(note);
                        setIsEditing(false);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {note.isPinned && <Pin className="h-3 w-3 text-primary" />}
                            {note.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                            <h3 className="font-medium text-foreground text-sm truncate">
                              {note.title || 'Untitled'}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {formatDate(note.updatedAt)}
                          </p>
                          <p className="text-xs text-foreground/80 line-clamp-2">
                            {getPreviewText(note.content)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {note.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {note.tags.slice(0, 2).map((tag) => (
                                  <Badge 
                                    key={tag} 
                                    variant="secondary" 
                                    className="text-xs px-1.5 py-0.5 bg-card/50"
                                  >
                                    #{tag}
                                  </Badge>
                                ))}
                                {note.tags.length > 2 && (
                                  <span className="text-xs text-muted-foreground">+{note.tags.length - 2}</span>
                                )}
                              </div>
                            )}
                            {note.mediaFiles.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                📎 {note.mediaFiles.length}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredNotes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Edit3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                      {searchQuery ? 'No notes found' : 'No notes in this folder'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col bg-card/20">
        {currentNote ? (
          <>
            {/* Editor Header */}
            <div className="p-4 border-b border-border/50 glass">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!showSidebar && (
                    <Button
                      onClick={() => setShowSidebar(true)}
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(currentNote.updatedAt)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      v{currentNote.version}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setViewMode(viewMode === 'editor' ? 'preview' : 'editor')}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/10"
                  >
                    {viewMode === 'editor' ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => toggleStar(currentNote.id)}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "hover:bg-primary/10",
                      currentNote.isStarred && "text-yellow-500"
                    )}
                  >
                    <Star className={cn("h-4 w-4", currentNote.isStarred && "fill-current")} />
                  </Button>
                  <Button
                    onClick={() => togglePin(currentNote.id)}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "hover:bg-primary/10",
                      currentNote.isPinned && "text-primary"
                    )}
                  >
                    <Pin className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setShowCollaboration(!showCollaboration)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/10"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/10"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteNote(currentNote.id)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Title */}
                  <div>
                    <Input
                      value={currentNote.title}
                      onChange={(e) => updateNote({ title: e.target.value })}
                      placeholder="Note title..."
                      className="text-2xl font-bold border-none p-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                      style={{ fontSize: '2rem', lineHeight: '2.5rem' }}
                    />
                  </div>

                  {/* Toolbar */}
                  {viewMode === 'editor' && (
                    <NotesToolbar
                      onFormat={handleFormat}
                      activeFormats={activeFormats}
                      isRecording={isRecording}
                      onStartRecording={() => setIsRecording(true)}
                      onStopRecording={() => setIsRecording(false)}
                    />
                  )}

                  {/* Content */}
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 glass">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="media">Media</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="space-y-4">
                      {viewMode === 'editor' ? (
                        <RichTextEditor
                          content={currentNote.content}
                          onChange={(content) => updateNote({ content })}
                          onFormatChange={setActiveFormats}
                          placeholder="Start writing your note..."
                        />
                      ) : (
                        <div 
                          className="min-h-[400px] p-4 rounded-lg border border-border/50 bg-card/50 text-foreground prose prose-slate dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: currentNote.content || '<p class="text-muted-foreground italic">No content yet...</p>' }}
                        />
                      )}
                    </TabsContent>
                    
                    <TabsContent value="media" className="space-y-4">
                      <MediaUploader
                        files={currentNote.mediaFiles}
                        onFilesChange={handleMediaUpload}
                      />
                    </TabsContent>
                    
                    <TabsContent value="settings" className="space-y-4">
                      <div className="space-y-4">
                        {/* Tags */}
                        <div>
                          <label className="text-sm font-medium text-foreground">Tags</label>
                          <div className="flex flex-wrap gap-2 items-center mt-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Add tags (comma separated)"
                              className="flex-1 glass border-border/50"
                              value={currentNote.tags.join(', ')}
                              onChange={(e) => updateNote({ 
                                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                              })}
                            />
                          </div>
                        </div>

                        {/* Note Color */}
                        <div>
                          <label className="text-sm font-medium text-foreground">Color</label>
                          <div className="flex gap-2 mt-2">
                            {['default', 'blue', 'green', 'yellow', 'red', 'purple'].map((color) => (
                              <button
                                key={color}
                                onClick={() => updateNote({ color })}
                                className={cn(
                                  "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                                  color === 'default' && "bg-card border-border",
                                  color === 'blue' && "bg-blue-500 border-blue-600",
                                  color === 'green' && "bg-green-500 border-green-600",
                                  color === 'yellow' && "bg-yellow-500 border-yellow-600",
                                  color === 'red' && "bg-red-500 border-red-600",
                                  color === 'purple' && "bg-purple-500 border-purple-600",
                                  currentNote.color === color && "ring-2 ring-primary ring-offset-2"
                                )}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Version History */}
                        <div>
                          <label className="text-sm font-medium text-foreground">Version History</label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 glass"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            View History (v{currentNote.version})
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Edit3 className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2 text-foreground">Create Your First Note</h3>
              <p className="text-sm mb-4">Start capturing your thoughts and ideas</p>
              <Button 
                onClick={createNewNote}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppleNotesEditor;