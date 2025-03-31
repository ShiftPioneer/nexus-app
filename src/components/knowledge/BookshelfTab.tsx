
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, BookOpen, LibraryBigIcon } from "lucide-react";
import { Book, ReadingStatus } from "@/types/knowledge";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookDialog } from "./BookDialog";
import { BookCard } from "./BookCard";

const sampleBooks: Book[] = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    readingStatus: "Reading Now",
    rating: 5,
    coverImage: "/sample-covers/atomic-habits.jpg",
    description: "Tiny changes, remarkable results",
    relatedSkillsets: ["Self-Improvement"],
    summary: "A practical guide about how to build good habits and break bad ones.",
    keyLessons: "Small changes compound over time. Focus on system over goals."
  },
  {
    id: "2",
    title: "Design Patterns",
    author: "Erich Gamma et al.",
    readingStatus: "Not Yet Read",
    rating: 0,
    coverImage: "/sample-covers/design-patterns.jpg",
    description: "Elements of Reusable Object-Oriented Software",
    relatedSkillsets: ["Programming", "Design"],
    summary: "",
    keyLessons: ""
  },
  {
    id: "3",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    readingStatus: "Finished",
    rating: 4,
    coverImage: "/sample-covers/thinking-fast-slow.jpg",
    description: "How the mind works and the two systems that drive the way we think",
    relatedSkillsets: ["Psychology", "Decision Making"],
    summary: "Explores the two systems that drive how we think and make choices.",
    keyLessons: "Our brains use two systems: fast, intuitive thinking and slow, rational thinking."
  }
];

interface BookshelfState {
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
      const newBooksByStatus = { ...booksByStatus };
      Object.keys(newBooksByStatus).forEach(status => {
        newBooksByStatus[status] = newBooksByStatus[status].filter(b => b.id !== book.id);
      });
      
      // Add to the correct status
      newBooksByStatus[book.readingStatus] = [
        ...newBooksByStatus[book.readingStatus],
        book
      ];
      
      setBooksByStatus(newBooksByStatus);
    } else {
      setBooksByStatus({
        ...booksByStatus,
        [book.readingStatus]: [
          ...booksByStatus[book.readingStatus],
          { ...book, id: Date.now().toString() }
        ]
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Bookshelf</h2>
        <div className="flex items-center gap-4">
          <div className="border rounded-md overflow-hidden flex">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              className="h-9 rounded-none"
              onClick={() => setViewMode("kanban")}
            >
              <LibraryBigIcon className="h-4 w-4 mr-2" />
              Kanban
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="h-9 rounded-none"
              onClick={() => setViewMode("list")}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <Button onClick={() => { setCurrentBook(null); setDialogOpen(true); }} className="gap-1">
            <Plus size={18} />
            Add Book
          </Button>
        </div>
      </div>
      
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(booksByStatus).map(([status, books]) => (
            <Card key={status} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-bold text-lg">{status}</h3>
                  <span className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                    {books.length}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {books.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                  
                  {books.length === 0 && (
                    <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground">
                      No books in this category
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Books</TabsTrigger>
            <TabsTrigger value="reading">Reading Now</TabsTrigger>
            <TabsTrigger value="toread">To Read</TabsTrigger>
            <TabsTrigger value="finished">Finished</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
              {allBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  listView
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reading" className="mt-4">
            <div className="space-y-4">
              {booksByStatus["Reading Now"].map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  listView
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="toread" className="mt-4">
            <div className="space-y-4">
              {booksByStatus["Not Yet Read"].map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  listView
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="finished" className="mt-4">
            <div className="space-y-4">
              {booksByStatus["Finished"].map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  listView
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
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
