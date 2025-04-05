
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LibraryBigIcon, BookOpen, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookDialog } from "./BookDialog";
import { BookCard } from "./BookCard";
import { Book, ReadingStatus } from "@/types/knowledge";

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

interface BookshelfState {
  [key: string]: Book[];
}

export function BookshelfTab() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

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
    setCoverImage(null);
  };
  
  const handleEdit = (book: Book) => {
    setCurrentBook(book);
    setCoverImage(book.coverImage || null);
    setDialogOpen(true);
  };
  
  const handleDelete = (book: Book) => {
    setBooksByStatus({
      ...booksByStatus,
      [book.readingStatus]: booksByStatus[book.readingStatus].filter(b => b.id !== book.id)
    });
  };
  
  const handleDragStart = (event: React.DragEvent, book: Book) => {
    event.dataTransfer.setData('book', JSON.stringify(book));
  };
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };
  
  const handleDrop = (event: React.DragEvent, status: ReadingStatus) => {
    event.preventDefault();
    const bookData = event.dataTransfer.getData('book');
    if (!bookData) return;
    try {
      const book = JSON.parse(bookData) as Book;
      if (book.readingStatus === status) return;

      // Remove the book from its current status
      const newBooksByStatus = {
        ...booksByStatus
      };
      newBooksByStatus[book.readingStatus] = booksByStatus[book.readingStatus].filter(b => b.id !== book.id);

      // Update the status and add to the new status
      book.readingStatus = status;
      newBooksByStatus[status] = [...newBooksByStatus[status], book];
      setBooksByStatus(newBooksByStatus);
    } catch (e) {
      console.error('Error parsing dragged book data', e);
    }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(booksByStatus).map(([status, books]) => (
            <Card 
              key={status} 
              className="overflow-hidden" 
              onDragOver={handleDragOver} 
              onDrop={e => handleDrop(e, status as ReadingStatus)}
            >
              <CardContent className="p-4 bg-orange-50 py-[26px] px-[26px]">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-bold text-lg text-secondary-light">{status}</h3>
                  <span className="bg-orange-100 rounded-full px-2 py-0.5 text-xs text-orange-800">
                    {books.length}
                  </span>
                </div>
                
                <div className="space-y-4 min-h-[150px]">
                  {books.map(book => (
                    <div key={book.id} draggable onDragStart={e => handleDragStart(e, book)} className="cursor-move">
                      <BookCard book={book} onEdit={handleEdit} onDelete={handleDelete} />
                    </div>
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
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">All Books</TabsTrigger>
            <TabsTrigger value="reading">Reading Now</TabsTrigger>
            <TabsTrigger value="toread">To Read</TabsTrigger>
            <TabsTrigger value="finished">Finished</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
              {allBooks.length > 0 ? (
                allBooks.map(book => (
                  <BookCard key={book.id} book={book} onEdit={handleEdit} onDelete={handleDelete} listView />
                ))
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No books added yet</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="reading" className="mt-4">
            <div className="space-y-4">
              {booksByStatus["Reading Now"].length > 0 ? (
                booksByStatus["Reading Now"].map(book => (
                  <BookCard key={book.id} book={book} onEdit={handleEdit} onDelete={handleDelete} listView />
                ))
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No books currently being read</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="toread" className="mt-4">
            <div className="space-y-4">
              {booksByStatus["Not Yet Read"].length > 0 ? (
                booksByStatus["Not Yet Read"].map(book => (
                  <BookCard key={book.id} book={book} onEdit={handleEdit} onDelete={handleDelete} listView />
                ))
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">Your reading list is empty</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="finished" className="mt-4">
            <div className="space-y-4">
              {booksByStatus["Finished"].length > 0 ? (
                booksByStatus["Finished"].map(book => (
                  <BookCard key={book.id} book={book} onEdit={handleEdit} onDelete={handleDelete} listView />
                ))
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No finished books yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <BookDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSave={handleAddBook} 
        book={currentBook} 
        coverImage={coverImage} 
        onCoverImageChange={setCoverImage} 
      />
    </div>
  );
}

// Export default as well for backward compatibility
export default BookshelfTab;
