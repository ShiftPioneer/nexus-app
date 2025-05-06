
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, BookOpen, Edit, Trash, Star, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  status: "to-read" | "reading" | "completed";
  rating?: number;
  notes?: string;
  tags: string[];
}

export const BookshelfTab = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<"all" | "to-read" | "reading" | "completed">("all");
  
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: "",
    author: "",
    cover: "",
    status: "to-read",
    rating: 0,
    notes: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  
  // Load books from localStorage
  useEffect(() => {
    const savedBooks = localStorage.getItem("knowledgeBooks");
    if (savedBooks) {
      try {
        setBooks(JSON.parse(savedBooks));
      } catch (e) {
        console.error("Failed to parse books from localStorage:", e);
      }
    }
  }, []);
  
  // Save books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("knowledgeBooks", JSON.stringify(books));
  }, [books]);
  
  const handleAddBook = () => {
    if (!newBook.title || !newBook.author) {
      toast({
        title: "Missing information",
        description: "Please provide at least a title and author.",
        variant: "destructive",
      });
      return;
    }
    
    const book: Book = {
      id: Date.now().toString(),
      title: newBook.title || "",
      author: newBook.author || "",
      cover: newBook.cover,
      status: newBook.status as "to-read" | "reading" | "completed",
      rating: newBook.rating,
      notes: newBook.notes,
      tags: newBook.tags || [],
    };
    
    setBooks([...books, book]);
    setNewBook({
      title: "",
      author: "",
      cover: "",
      status: "to-read",
      rating: 0,
      notes: "",
      tags: [],
    });
    setShowAddDialog(false);
    
    toast({
      title: "Book added",
      description: `"${book.title}" has been added to your bookshelf.`,
    });
  };
  
  const handleUpdateBook = () => {
    if (!currentBook || !currentBook.title || !currentBook.author) {
      toast({
        title: "Missing information",
        description: "Please provide at least a title and author.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedBooks = books.map(book => 
      book.id === currentBook.id ? currentBook : book
    );
    
    setBooks(updatedBooks);
    setShowEditDialog(false);
    
    toast({
      title: "Book updated",
      description: `"${currentBook.title}" has been updated.`,
    });
  };
  
  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
    
    toast({
      title: "Book removed",
      description: "The book has been removed from your bookshelf.",
    });
  };
  
  const handleAddTag = () => {
    if (tagInput.trim()) {
      if (showAddDialog) {
        setNewBook({
          ...newBook,
          tags: [...(newBook.tags || []), tagInput.trim()],
        });
      } else if (showEditDialog && currentBook) {
        setCurrentBook({
          ...currentBook,
          tags: [...(currentBook.tags || []), tagInput.trim()],
        });
      }
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    if (showAddDialog) {
      setNewBook({
        ...newBook,
        tags: (newBook.tags || []).filter(t => t !== tag),
      });
    } else if (showEditDialog && currentBook) {
      setCurrentBook({
        ...currentBook,
        tags: currentBook.tags.filter(t => t !== tag),
      });
    }
  };
  
  const renderStarRating = (rating?: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            (rating || 0) > index ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
          }`}
        />
      ));
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "to-read":
        return "bg-blue-500/10 text-blue-500";
      case "reading":
        return "bg-yellow-500/10 text-yellow-500";
      case "completed":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const filteredBooks = filterStatus === "all" 
    ? books 
    : books.filter(book => book.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">My Bookshelf</h2>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1 flex-1 sm:flex-initial">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex-1"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm" 
              onClick={() => setViewMode("list")}
              className="flex-1"
            >
              List
            </Button>
          </div>
          
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        </div>
      </div>
      
      {/* Status Filter */}
      <Tabs
        value={filterStatus}
        onValueChange={(v) => setFilterStatus(v as any)}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-4 h-auto">
          <TabsTrigger value="all" className="py-2">All</TabsTrigger>
          <TabsTrigger value="to-read" className="py-2">To Read</TabsTrigger>
          <TabsTrigger value="reading" className="py-2">Reading</TabsTrigger>
          <TabsTrigger value="completed" className="py-2">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredBooks.length === 0 ? (
        <div className="text-center p-10 border border-dashed rounded-md">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Your bookshelf is empty</h3>
          <p className="text-muted-foreground mb-4">
            Start adding books you've read or want to read.
          </p>
          <Button onClick={() => setShowAddDialog(true)}>Add Your First Book</Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <Card key={book.id} className="flex flex-col h-full overflow-hidden">
              <div className="relative h-48 bg-muted">
                {book.cover ? (
                  <img 
                    src={book.cover} 
                    alt={`Cover of ${book.title}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground/40" />
                  </div>
                )}
                
                <Badge className={`absolute top-2 right-2 ${getStatusColor(book.status)}`}>
                  {book.status === "to-read" ? "To Read" : 
                   book.status === "reading" ? "Reading" : 
                   "Completed"}
                </Badge>
              </div>
              
              <CardContent className="flex-grow p-4">
                <div className="space-y-1 mb-2">
                  <h3 className="font-bold text-base line-clamp-2" title={book.title}>{book.title}</h3>
                  <p className="text-muted-foreground text-sm" title={`by ${book.author}`}>by {book.author}</p>
                </div>
                
                {book.rating !== undefined && book.rating > 0 && (
                  <div className="flex items-center mt-2">
                    {renderStarRating(book.rating)}
                  </div>
                )}
                
                {book.tags && book.tags.length > 0 && (
                  <ScrollArea className="h-10 mt-2">
                    <div className="flex flex-wrap gap-1">
                      {book.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                )}
                
                {book.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground line-clamp-2 overflow-hidden" title={book.notes}>
                      {book.notes}
                    </p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="p-4 pt-2 border-t bg-muted/30 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentBook(book);
                    setShowEditDialog(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteBook(book.id)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredBooks.map(book => (
            <Card key={book.id} className="overflow-hidden">
              <div className="flex items-center p-4">
                <div className="h-16 w-16 flex-shrink-0 mr-4 rounded overflow-hidden bg-muted">
                  {book.cover ? (
                    <img 
                      src={book.cover} 
                      alt={`Cover of ${book.title}`}
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold line-clamp-1" title={book.title}>{book.title}</h3>
                      <p className="text-muted-foreground text-sm truncate" title={`by ${book.author}`}>by {book.author}</p>
                    </div>
                    <Badge className={getStatusColor(book.status)}>
                      {book.status === "to-read" ? "To Read" : 
                       book.status === "reading" ? "Reading" : 
                       "Completed"}
                    </Badge>
                  </div>
                  
                  {book.rating !== undefined && book.rating > 0 && (
                    <div className="flex items-center mt-1">
                      {renderStarRating(book.rating)}
                    </div>
                  )}
                  
                  {book.tags && book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 overflow-hidden" style={{ maxHeight: "1.5rem" }}>
                      {book.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {book.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{book.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentBook(book);
                      setShowEditDialog(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Book Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto pointer-events-auto">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBook.title || ""}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={newBook.author || ""}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="cover">Cover URL (optional)</Label>
                <Input
                  id="cover"
                  value={newBook.cover || ""}
                  onChange={(e) => setNewBook({ ...newBook, cover: e.target.value })}
                  placeholder="https://example.com/book-cover.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Reading Status</Label>
                <select
                  id="status"
                  className="w-full border rounded-md p-2 bg-background"
                  value={newBook.status}
                  onChange={(e) => setNewBook({ 
                    ...newBook, 
                    status: e.target.value as "to-read" | "reading" | "completed" 
                  })}
                >
                  <option value="to-read">To Read</option>
                  <option value="reading">Reading</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              {newBook.status === "completed" && (
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewBook({ ...newBook, rating: star })}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            (newBook.rating || 0) >= star 
                              ? "text-yellow-500 fill-yellow-500" 
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={newBook.notes || ""}
                  onChange={(e) => setNewBook({ ...newBook, notes: e.target.value })}
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                
                {newBook.tags && newBook.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newBook.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button 
                          onClick={() => handleRemoveTag(tag)} 
                          className="text-xs rounded-full hover:bg-background ml-1 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBook}>Add Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto pointer-events-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          
          {currentBook && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={currentBook.title}
                    onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-author">Author</Label>
                  <Input
                    id="edit-author"
                    value={currentBook.author}
                    onChange={(e) => setCurrentBook({ ...currentBook, author: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-cover">Cover URL (optional)</Label>
                  <Input
                    id="edit-cover"
                    value={currentBook.cover || ""}
                    onChange={(e) => setCurrentBook({ ...currentBook, cover: e.target.value })}
                    placeholder="https://example.com/book-cover.jpg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-status">Reading Status</Label>
                  <select
                    id="edit-status"
                    className="w-full border rounded-md p-2 bg-background"
                    value={currentBook.status}
                    onChange={(e) => setCurrentBook({ 
                      ...currentBook, 
                      status: e.target.value as "to-read" | "reading" | "completed" 
                    })}
                  >
                    <option value="to-read">To Read</option>
                    <option value="reading">Reading</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                {currentBook.status === "completed" && (
                  <div>
                    <Label htmlFor="edit-rating">Rating</Label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCurrentBook({ ...currentBook, rating: star })}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              (currentBook.rating || 0) >= star 
                                ? "text-yellow-500 fill-yellow-500" 
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="edit-notes">Notes (optional)</Label>
                  <Textarea
                    id="edit-notes"
                    value={currentBook.notes || ""}
                    onChange={(e) => setCurrentBook({ ...currentBook, notes: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-tags">Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="edit-tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  
                  {currentBook.tags && currentBook.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {currentBook.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button 
                            onClick={() => handleRemoveTag(tag)} 
                            className="text-xs rounded-full hover:bg-background ml-1 p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBook}>Update Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
