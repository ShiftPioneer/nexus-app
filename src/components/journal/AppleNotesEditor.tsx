import React, { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  FolderPlus,
  Tag,
  Calendar,
  Grid3X3,
  AlignLeft,
  ChevronRight,
  MoreHorizontal,
  Star,
  Archive,
  Trash2,
  Share,
  Lock,
  Pin,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  color?: string;
}

interface Folder {
  id: string;
  name: string;
  color: string;
  noteCount: number;
}

const AppleNotesEditor = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'all', name: 'All Notes', color: 'blue', noteCount: 0 },
    { id: 'recent', name: 'Recently Added', color: 'green', noteCount: 0 }
  ]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

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
      isArchived: false
    };

    setNotes(prev => [newNote, ...prev]);
    setCurrentNote(newNote);
    setIsEditing(true);
    toast.success("New note created");
  }, [selectedFolder]);

  const updateNote = useCallback((updates: Partial<Note>) => {
    if (!currentNote) return;

    const updatedNote = { ...currentNote, ...updates, updatedAt: new Date() };
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
    <div className="flex h-[calc(100vh-200px)] bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notes</h2>
                <Button
                  onClick={createNewNote}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/60 dark:bg-slate-900/60 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Folders */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="space-y-1">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors",
                      selectedFolder === folder.id
                        ? "bg-primary/20 text-primary"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", 
                        folder.color === 'blue' && "bg-blue-500",
                        folder.color === 'green' && "bg-green-500",
                        folder.color === 'purple' && "bg-purple-500"
                      )} />
                      <span>{folder.name}</span>
                    </div>
                    <span className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded-full">
                      {folder.noteCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                <AnimatePresence>
                  {filteredNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 group relative",
                        currentNote?.id === note.id
                          ? "bg-primary/10 border border-primary/20 shadow-sm"
                          : "hover:bg-white/60 dark:hover:bg-slate-700/60"
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
                            <h3 className="font-medium text-slate-900 dark:text-white text-sm truncate">
                              {note.title || 'Untitled'}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                            {formatDate(note.updatedAt)}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                            {getPreviewText(note.content)}
                          </p>
                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {note.tags.slice(0, 2).map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary" 
                                  className="text-xs px-1.5 py-0.5 bg-slate-200 dark:bg-slate-600"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                              {note.tags.length > 2 && (
                                <span className="text-xs text-slate-400">+{note.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredNotes.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <AlignLeft className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                      {searchQuery ? 'No notes found' : 'No notes yet'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {currentNote ? (
          <>
            {/* Editor Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!showSidebar && (
                    <Button
                      onClick={() => setShowSidebar(true)}
                      variant="ghost"
                      size="sm"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(currentNote.updatedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => togglePin(currentNote.id)}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "hover:bg-slate-200 dark:hover:bg-slate-700",
                      currentNote.isPinned && "text-primary"
                    )}
                  >
                    <Pin className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteNote(currentNote.id)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {isEditing ? 'Done' : 'Edit'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-6 bg-white dark:bg-slate-900 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                {/* Title */}
                <div className="mb-6">
                  {isEditing ? (
                    <Input
                      value={currentNote.title}
                      onChange={(e) => updateNote({ title: e.target.value })}
                      placeholder="Title"
                      className="text-2xl font-bold border-none p-0 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                      style={{ fontSize: '2rem', lineHeight: '2.5rem' }}
                    />
                  ) : (
                    <h1 
                      className="text-2xl font-bold text-slate-900 dark:text-white cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setIsEditing(true)}
                    >
                      {currentNote.title || 'Untitled'}
                    </h1>
                  )}
                </div>

                {/* Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {isEditing ? (
                    <Textarea
                      value={currentNote.content}
                      onChange={(e) => updateNote({ content: e.target.value })}
                      placeholder="Start writing..."
                      className="min-h-[400px] border-none p-0 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                      style={{ fontSize: '1rem', lineHeight: '1.75' }}
                    />
                  ) : (
                    <div 
                      className="min-h-[400px] cursor-text text-slate-900 dark:text-white whitespace-pre-wrap"
                      onClick={() => setIsEditing(true)}
                    >
                      {currentNote.content || (
                        <span className="text-slate-400 italic">Click to start writing...</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {isEditing && (
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-2 items-center">
                      <Hash className="h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Add tags (comma separated)"
                        className="flex-1 border-none p-0 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                        value={currentNote.tags.join(', ')}
                        onChange={(e) => updateNote({ 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-900">
            <div className="text-center text-slate-400">
              <AlignLeft className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">Select a Note</h3>
              <p className="text-sm mb-4">Choose a note from the sidebar to start reading or editing</p>
              <Button 
                onClick={createNewNote}
                className="bg-primary hover:bg-primary/90 text-white"
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