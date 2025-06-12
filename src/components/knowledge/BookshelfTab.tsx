import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, BookOpen, Clock, Calendar, Grid, List, Star } from "lucide-react";
import { BookDialog } from "./BookDialog";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: "want-to-read" | "reading" | "completed";
  progress: number;
  startDate?: Date;
  completedDate?: Date;
  rating?: number;
  notes?: string;
  coverUrl?: string;
}

const BookshelfTab = () => {
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self-Help",
      status: "completed",
      progress: 100,
      rating: 5,
      completedDate: new Date("2024-01-15"),
    },
    {
      id: "2", 
      title: "The 7 Habits of Highly Effective People",
      author: "Stephen Covey",
      category: "Business",
      status: "reading",
      progress: 65,
      startDate: new Date("2024-01-20"),
    },
    {
      id: "3",
      title: "Deep Work",
      author: "Cal Newport", 
      category: "Productivity",
      status: "want-to-read",
      progress: 0,
    }
  ]);
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || book.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSaveBook = (book: Book) => {
    if (selectedBook) {
      setBooks(books.map(b => b.id === book.id ? book : b));
    } else {
      setBooks([...books, { ...book, id: Date.now().toString() }]);
    }
    setSelectedBook(null);
    setShowBookDialog(false);
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter(b => b.id !== bookId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "reading": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "want-to-read": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredBooks.map((book) => (
        <Card 
          key={book.id} 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 group h-fit"
          onClick={() => {
            setSelectedBook(book);
            setShowBookDialog(true);
          }}
        >
          <CardHeader className="pb-3">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/30 rounded-lg mb-3 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/40 transition-all">
              <BookOpen className="h-8 w-8 text-primary/60" />
            </div>
            <CardTitle className="text-base font-semibold line-clamp-2 leading-tight">
              {book.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(book.status)} variant="secondary">
                {book.status.replace("-", " ")}
              </Badge>
              <span className="text-xs text-muted-foreground">{book.category}</span>
            </div>
            
            {book.status === "reading" && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{book.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all" 
                    style={{ width: `${book.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {book.rating && (
              <div className="flex items-center gap-2">
                {renderStars(book.rating)}
                <span className="text-xs text-muted-foreground">({book.rating}/5)</span>
              </div>
            )}
            
            {book.completedDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Completed {book.completedDate.toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {filteredBooks.map((book) => (
        <Card 
          key={book.id}
          className="cursor-pointer hover:shadow-md transition-all"
          onClick={() => {
            setSelectedBook(book);
            setShowBookDialog(true);
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-16 bg-gradient-to-br from-primary/10 to-primary/30 rounded flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-4 w-4 text-primary/60" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{book.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(book.status)} variant="secondary">
                    {book.status.replace("-", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{book.category}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {book.status === "reading" && (
                  <div className="text-xs text-muted-foreground">{book.progress}%</div>
                )}
                {book.rating && renderStars(book.rating)}
                {book.completedDate && (
                  <div className="text-xs text-muted-foreground">
                    {book.completedDate.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button onClick={() => {
            setSelectedBook(null);
            setShowBookDialog(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="w-fit">
          <TabsTrigger value="all">All Books ({books.length})</TabsTrigger>
          <TabsTrigger value="want-to-read">
            Want to Read ({books.filter(b => b.status === "want-to-read").length})
          </TabsTrigger>
          <TabsTrigger value="reading">
            Reading ({books.filter(b => b.status === "reading").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({books.filter(b => b.status === "completed").length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeFilter} className="mt-6">
          {filteredBooks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No books found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchTerm 
                    ? "Try adjusting your search terms or add a new book to your library." 
                    : "Start building your digital library by adding your first book."}
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    setSelectedBook(null);
                    setShowBookDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              </CardContent>
            </Card>
          ) : (
            viewMode === "grid" ? renderGridView() : renderListView()
          )}
        </TabsContent>
      </Tabs>

      <BookDialog
        open={showBookDialog}
        onOpenChange={setShowBookDialog}
        book={selectedBook}
        onSave={handleSaveBook}
        onDelete={handleDeleteBook}
      />
    </div>
  );
};

export default BookshelfTab;
