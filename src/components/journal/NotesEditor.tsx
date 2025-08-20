import React, { useState, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./notes-editor.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Plus, 
  Search, 
  FileText, 
  Image, 
  Link, 
  Table, 
  List,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

const NotesEditor = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'blockquote', 'code-block',
    'list', 'bullet',
    'indent',
    'align',
    'link', 'image', 'video'
  ];

  const createNewNote = useCallback(() => {
    if (!newNoteTitle.trim()) {
      toast.error("Please enter a note title");
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle.trim(),
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    };

    setNotes(prev => [newNote, ...prev]);
    setCurrentNote(newNote);
    setIsEditing(true);
    setNewNoteTitle("");
    toast.success("New note created");
  }, [newNoteTitle]);

  const saveNote = useCallback(() => {
    if (!currentNote) return;

    setNotes(prev => prev.map(note => 
      note.id === currentNote.id 
        ? { ...currentNote, updatedAt: new Date() }
        : note
    ));
    setIsEditing(false);
    toast.success("Note saved");
  }, [currentNote]);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (currentNote?.id === noteId) {
      setCurrentNote(null);
      setIsEditing(false);
    }
    toast.success("Note deleted");
  }, [currentNote]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
      {/* Notes List Sidebar */}
      <div className="col-span-12 lg:col-span-4 space-y-4">
        {/* Search and New Note */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="New note title..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="flex-1 bg-slate-800/50 border-slate-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && createNewNote()}
              />
              <Button 
                onClick={createNewNote}
                className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notes List */}
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-350px)]">
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  currentNote?.id === note.id
                    ? 'bg-primary/20 border-primary/40'
                    : 'bg-slate-900/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50'
                }`}
                onClick={() => {
                  setCurrentNote(note);
                  setIsEditing(false);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{note.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <FileText className="h-4 w-4 text-slate-400 flex-shrink-0 ml-2" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredNotes.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              {searchQuery ? 'No notes found' : 'No notes yet. Create your first note!'}
            </div>
          )}
        </div>
      </div>

      {/* Note Editor */}
      <div className="col-span-12 lg:col-span-8">
        {currentNote ? (
          <Card className="h-full bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="pb-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{currentNote.title}</CardTitle>
                  <p className="text-sm text-slate-400 mt-1">
                    Last updated: {new Date(currentNote.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <Button
                      onClick={saveNote}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteNote(currentNote.id)}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 h-[calc(100%-120px)]">
              <div className="h-full">
                <ReactQuill
                  theme="snow"
                  value={currentNote.content}
                  onChange={(content) => {
                    if (isEditing) {
                      setCurrentNote(prev => prev ? { ...prev, content } : null);
                    }
                  }}
                  modules={modules}
                  formats={formats}
                  readOnly={!isEditing}
                  className={`h-full ${
                    isEditing 
                      ? 'notes-editor-active' 
                      : 'notes-editor-readonly'
                  }`}
                  style={{
                    height: '100%',
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full bg-slate-900/50 backdrop-blur-sm border-slate-700/50 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Select a Note</h3>
              <p>Choose a note from the sidebar to start reading or editing</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotesEditor;