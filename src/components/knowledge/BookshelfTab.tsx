
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import { Book, ReadingStatus } from "@/types/knowledge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookDialog } from "./BookDialog";
import { useToast } from "@/hooks/use-toast";
import { BookshelfKanbanView } from "./BookshelfTab/BookshelfKanbanView";
import { BookshelfListView } from "./BookshelfTab/BookshelfListView";
import { useKnowledge } from "@/contexts/KnowledgeContext";

export type BookshelfState = Record<ReadingStatus, Book[]>;

export function BookshelfTab() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { toast } = useToast();
  const [coverImage, setCoverImage] = useState<string>("");
  const { books = [], addBook, updateBook, deleteBook } = useKnowledge();

  // Group books by reading status
  const booksByStatus = React.useMemo(() => {
    const result: BookshelfState = {
      "Not Started": [],
      "In Progress": [],
      "Completed": [],
      "Reading Now": [],
      "Not Yet Read": [],
      "Finished": [],
      "abandoned": []
    };
    
    books.forEach(book => {
      if (!result[book.readingStatus]) {
        result[book.readingStatus] = [];
      }
      result[book.readingStatus].push(book);
    });
    
    return result;
  }, [books]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredBooksByStatus = React.useMemo(() => {
    const result: BookshelfState = {} as BookshelfState;
    
    Object.entries(booksByStatus).forEach(([status, statusBooks]) => {
      result[status as ReadingStatus] = statusBooks.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
    
    return result;
  }, [booksByStatus, searchQuery]);

  const allFilteredBooks = React.useMemo(() => 
    Object.values(filteredBooksByStatus).flat(), 
    [filteredBooksByStatus]
  );

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
    deleteBook(book.id);
    
    toast({
      title: "Book deleted",
      description: `"${book.title}" has been removed from your bookshelf.`,
    });
  };

  const handleSaveBook = (book: Book) => {
    if (editingBook) {
      updateBook(book.id, book);
      
      toast({
        title: "Book updated",
        description: `"${book.title}" has been updated in your bookshelf.`,
      });
    } else {
      addBook(book);
      
      toast({
        title: "Book added",
        description: `"${book.title}" has been added to your bookshelf.`,
      });
    }
    
    setDialogOpen(false);
    setEditingBook(null);
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
          setBooksByStatus={(newState) => {
            // This is just a UI state, the actual updates happen when user edits a book
          }}
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

export default BookshelfTab;
