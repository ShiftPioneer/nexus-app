
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import { Book, ReadingStatus } from "@/types/knowledge";
import { BookshelfKanbanView } from "./BookshelfKanbanView";
import { BookshelfListView } from "./BookshelfListView";
import { BookDialog } from "../BookDialog";
import { useToast } from "@/hooks/use-toast";

export type BookshelfState = {
  [key in ReadingStatus]: Book[];
};

export function BookshelfTab() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { toast } = useToast();
  const [coverImage, setCoverImage] = useState<string>("");

  // Sample books data
  const [booksByStatus, setBooksByStatus] = useState<BookshelfState>({
    "Not Started": [
      {
        id: "1",
        title: "Atomic Habits",
        author: "James Clear",
        coverImage: "https://covers.openlibrary.org/b/id/8479576-M.jpg",
        description: "Tiny Changes, Remarkable Results",
        readingStatus: "Not Started",
        dateAdded: new Date(2023, 0, 15),
        genre: "Self Improvement",
        tags: ["habits", "psychology"],
        notes: "",
        rating: 0
      },
      {
        id: "2",
        title: "Deep Work",
        author: "Cal Newport",
        coverImage: "https://covers.openlibrary.org/b/id/10110013-M.jpg",
        description: "Rules for Focused Success in a Distracted World",
        readingStatus: "Not Started",
        dateAdded: new Date(2023, 1, 20),
        genre: "Productivity",
        tags: ["focus", "productivity"],
        notes: "",
        rating: 0
      }
    ],
    "In Progress": [
      {
        id: "3",
        title: "The Psychology of Money",
        author: "Morgan Housel",
        coverImage: "https://covers.openlibrary.org/b/id/10356439-M.jpg",
        description: "Timeless lessons on wealth, greed, and happiness",
        readingStatus: "In Progress",
        dateAdded: new Date(2023, 2, 5),
        genre: "Finance",
        currentPage: 120,
        totalPages: 256,
        tags: ["money", "psychology"],
        notes: "Interesting perspectives on how people think about money differently.",
        rating: 0
      }
    ],
    "Completed": [
      {
        id: "4",
        title: "Project Hail Mary",
        author: "Andy Weir",
        coverImage: "https://covers.openlibrary.org/b/id/10389354-M.jpg",
        description: "A lone astronaut must save the earth from disaster",
        readingStatus: "Completed",
        dateAdded: new Date(2022, 11, 10),
        dateCompleted: new Date(2023, 0, 5),
        genre: "Science Fiction",
        rating: 5,
        tags: ["sci-fi", "space"],
        notes: "Excellent story with great character development."
      }
    ],
    "Reading Now": [],
    "Not Yet Read": [],
    "Finished": [],
    "abandoned": []
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredBooksByStatus = Object.entries(booksByStatus).reduce((acc, [status, books]) => {
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    acc[status as ReadingStatus] = filtered;
    return acc;
  }, {} as BookshelfState);

  const allFilteredBooks = Object.values(filteredBooksByStatus).flat();

  const handleAddNewBook = () => {
    setEditingBook(null);
    setCoverImage("");
    setDialogOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setCoverImage(book.coverImage || "");
    setDialogOpen(true);
  };

  const handleDeleteBook = (book: Book) => {
    const newBooksByStatus = { ...booksByStatus };
    newBooksByStatus[book.readingStatus] = 
      booksByStatus[book.readingStatus].filter(b => b.id !== book.id);
    
    setBooksByStatus(newBooksByStatus);
    
    toast({
      title: "Book deleted",
      description: `"${book.title}" has been removed from your bookshelf.`,
    });
  };

  const handleSaveBook = (book: Book) => {
    const newBooksByStatus = { ...booksByStatus };
    
    // If editing an existing book
    if (editingBook) {
      // Remove the book from its current status
      newBooksByStatus[editingBook.readingStatus] = 
        booksByStatus[editingBook.readingStatus].filter(b => b.id !== editingBook.id);
      
      // If the status changed, ensure the new status category exists
      if (!newBooksByStatus[book.readingStatus]) {
        newBooksByStatus[book.readingStatus] = [];
      }
    } else {
      // For new books, ensure the status category exists
      if (!newBooksByStatus[book.readingStatus]) {
        newBooksByStatus[book.readingStatus] = [];
      }
      
      // Generate an ID for new book
      book.id = Date.now().toString();
    }
    
    // Add the book to the appropriate status
    newBooksByStatus[book.readingStatus] = [
      ...newBooksByStatus[book.readingStatus],
      { ...book, coverImage: coverImage || book.coverImage }
    ];
    
    setBooksByStatus(newBooksByStatus);
    setDialogOpen(false);
    
    toast({
      title: editingBook ? "Book updated" : "Book added",
      description: `"${book.title}" has been ${editingBook ? 'updated' : 'added to your bookshelf'}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-96">
          <Label htmlFor="search-books" className="sr-only">Search books</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-books"
              placeholder="Search by title, author, or description..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as "kanban" | "list")}
            className="hidden sm:flex"
          >
            <TabsList>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleAddNewBook} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        </div>
      </div>

      {/* Mobile view mode selection */}
      <div className="flex sm:hidden justify-center mb-6">
        <Tabs 
          value={viewMode} 
          onValueChange={(value) => setViewMode(value as "kanban" | "list")}
        >
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "kanban" ? (
        <BookshelfKanbanView
          booksByStatus={filteredBooksByStatus} 
          setBooksByStatus={setBooksByStatus}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
        />
      ) : (
        <BookshelfListView
          booksByStatus={filteredBooksByStatus}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          allBooks={allFilteredBooks}
        />
      )}

      <BookDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveBook}
        book={editingBook}
        bookCoverImage={coverImage}
        onBookCoverImageChange={setCoverImage}
      />
    </div>
  );
}
