
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LibraryBigIcon, BookOpen, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookDialog } from "../BookDialog";
import { BookCard } from "../BookCard";
import { Book, ReadingStatus } from "@/types/knowledge";
import { BookshelfKanbanView } from "./BookshelfKanbanView";
import { BookshelfListView } from "./BookshelfListView";

// Sample books data with corrected types
const sampleBooks: Book[] = [{
  id: "1",
  title: "Atomic Habits",
  author: "James Clear",
  readingStatus: "Reading Now" as ReadingStatus,
  rating: 5,
  coverImage: "/sample-covers/atomic-habits.jpg",
  description: "Tiny changes, remarkable results",
  relatedSkillsets: ["Self-Improvement"],
  summary: "A practical guide about how to build good habits and break bad ones.",
  keyLessons: "Small changes compound over time. Focus on system over goals.",
  dateAdded: new Date(),
  tags: ["habits", "self-improvement"]
}, {
  id: "2",
  title: "Design Patterns",
  author: "Erich Gamma et al.",
  readingStatus: "Not Yet Read" as ReadingStatus,
  rating: 0,
  coverImage: "/sample-covers/design-patterns.jpg",
  description: "Elements of Reusable Object-Oriented Software",
  relatedSkillsets: ["Programming", "Design"],
  summary: "",
  keyLessons: "",
  dateAdded: new Date(),
  tags: ["programming", "design"]
}, {
  id: "3",
  title: "Thinking, Fast and Slow",
  author: "Daniel Kahneman",
  readingStatus: "Finished" as ReadingStatus,
  rating: 4,
  coverImage: "/sample-covers/thinking-fast-slow.jpg",
  description: "How the mind works and the two systems that drive the way we think",
  relatedSkillsets: ["Psychology", "Decision Making"],
  summary: "Explores the two systems that drive how we think and make choices.",
  keyLessons: "Our brains use two systems: fast, intuitive thinking and slow, rational thinking.",
  dateAdded: new Date(),
  tags: ["psychology", "decision-making"]
}];

export interface BookshelfState {
  [key: string]: Book[];
}

export function BookshelfTab() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  
  // Initialize books by reading status
  const initialState: BookshelfState = {
    "Reading Now": [],
    "Not Yet Read": [],
    "Finished": []
  };
  
  sampleBooks.forEach(book => {
    initialState[book.readingStatus].push(book);
  });
  
  const [booksByStatus, setBooksByStatus] = useState<BookshelfState>(initialState);
  
  const handleAddBook = (book: Book) => {
    if (currentBook) {
      // Remove the book from its previous status (if it changed)
      const newBooksByStatus = {
        ...booksByStatus
      };
      Object.keys(newBooksByStatus).forEach(status => {
        newBooksByStatus[status] = newBooksByStatus[status].filter(b => b.id !== book.id);
      });

      // Add to the correct status
      newBooksByStatus[book.readingStatus] = [...newBooksByStatus[book.readingStatus], book];
      setBooksByStatus(newBooksByStatus);
    } else {
      setBooksByStatus({
        ...booksByStatus,
        [book.readingStatus]: [...booksByStatus[book.readingStatus], {
          ...book,
          id: Date.now().toString()
        }]
      });
    }
    setDialogOpen(false);
    setCurrentBook(null);
  };
  
  const handleEdit = (book: Book) => {
    setCurrentBook(book);
    setDialogOpen(true);
  };
  
  const handleDelete = (book: Book) => {
    setBooksByStatus({
      ...booksByStatus,
      [book.readingStatus]: booksByStatus[book.readingStatus].filter(b => b.id !== book.id)
    });
  };
  
  // Calculate all books across all statuses
  const allBooks = Object.values(booksByStatus).flat();
  
  return (
    <div className="space-y-6 py-[20px] px-[20px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Your Bookshelf</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="border rounded-md overflow-hidden flex">
            <Button variant={viewMode === "kanban" ? "default" : "ghost"} size="sm" className="h-9 rounded-none" onClick={() => setViewMode("kanban")}>
              <LibraryBigIcon className="h-4 w-4 mr-2" />
              Kanban
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" className="h-9 rounded-none" onClick={() => setViewMode("list")}>
              <BookOpen className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <Button onClick={() => {
          setCurrentBook(null);
          setDialogOpen(true);
        }} className="gap-1 w-full sm:w-auto">
            <Plus size={18} />
            Add Book
          </Button>
        </div>
      </div>
      
      {viewMode === "kanban" ? (
        <BookshelfKanbanView 
          booksByStatus={booksByStatus} 
          setBooksByStatus={setBooksByStatus}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <BookshelfListView 
          booksByStatus={booksByStatus}
          allBooks={allBooks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      
      <BookDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSave={handleAddBook} 
        book={currentBook}
      />
    </div>
  );
}
