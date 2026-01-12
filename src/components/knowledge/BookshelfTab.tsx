import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, BookOpen, Grid, List, Star, Quote, Target, TrendingUp, Library, BookMarked, Clock, CheckCircle, Bookmark, Edit, Trash2 } from "lucide-react";
import BookDialog from "./BookDialog";
import { Book } from "@/types/knowledge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExtendedBook extends Book {
  currentPage?: number;
  totalPages?: number;
  quotes?: string[];
  dateStarted?: string;
  dateCompleted?: string;
}

const defaultBooks: ExtendedBook[] = [{
  id: "1",
  title: "Atomic Habits",
  author: "James Clear",
  readingStatus: "Finished",
  rating: 5,
  description: "A comprehensive guide to building good habits and breaking bad ones.",
  relatedSkillsets: ["Self-Improvement", "Productivity"],
  summary: "Small changes can make a big difference over time.",
  keyLessons: "Focus on systems rather than goals, make habits obvious, attractive, easy, and satisfying.",
  currentPage: 320,
  totalPages: 320,
  quotes: ["You do not rise to the level of your goals. You fall to the level of your systems."],
  dateCompleted: "2024-01-15"
}, {
  id: "2",
  title: "The 7 Habits of Highly Effective People",
  author: "Stephen Covey",
  readingStatus: "Reading Now",
  rating: 4,
  description: "Timeless principles for personal and professional effectiveness.",
  relatedSkillsets: ["Leadership", "Business"],
  summary: "Character-based approach to personal and interpersonal effectiveness.",
  keyLessons: "Be proactive, begin with the end in mind, put first things first.",
  currentPage: 180,
  totalPages: 432,
  dateStarted: "2024-01-01"
}, {
  id: "3",
  title: "Deep Work",
  author: "Cal Newport",
  readingStatus: "Not Yet Read",
  rating: 0,
  description: "Rules for focused success in a distracted world.",
  relatedSkillsets: ["Productivity", "Focus"],
  summary: "The ability to focus without distraction on cognitively demanding tasks.",
  keyLessons: "Cultivate deep work habits, eliminate shallow work, embrace boredom.",
  totalPages: 296
}];

const BookshelfTab = () => {
  const [books, setBooks] = useLocalStorage<ExtendedBook[]>("userBooks", defaultBooks);
  const [selectedBook, setSelectedBook] = useState<ExtendedBook | null>(null);
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [readingGoal, setReadingGoal] = useLocalStorage<number>("readingGoal", 12);

  // Stats
  const stats = useMemo(() => ({
    total: books.length,
    reading: books.filter(b => b.readingStatus === "Reading Now").length,
    completed: books.filter(b => b.readingStatus === "Finished").length,
    wantToRead: books.filter(b => b.readingStatus === "Not Yet Read").length,
    avgRating: books.filter(b => b.rating > 0).length > 0 
      ? (books.filter(b => b.rating > 0).reduce((acc, b) => acc + b.rating, 0) / books.filter(b => b.rating > 0).length).toFixed(1)
      : "0",
    totalPages: books.reduce((acc, b) => acc + (b.totalPages || 0), 0),
    pagesRead: books.reduce((acc, b) => acc + (b.currentPage || 0), 0),
  }), [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === "all" || book.readingStatus === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [books, searchTerm, activeFilter]);

  const handleSaveBook = (book: ExtendedBook) => {
    if (selectedBook) {
      setBooks(books.map(b => b.id === book.id ? book : b));
      toast.success("Book updated!");
    } else {
      setBooks([...books, {
        ...book,
        id: Date.now().toString()
      }]);
      toast.success("Book added to your library!");
    }
    setSelectedBook(null);
    setShowBookDialog(false);
    setCoverImage(null);
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter(b => b.id !== bookId));
    toast.success("Book removed from library");
  };

  const updateReadingProgress = (bookId: string, currentPage: number) => {
    setBooks(books.map(b => {
      if (b.id !== bookId) return b;
      const isComplete = b.totalPages && currentPage >= b.totalPages;
      return {
        ...b,
        currentPage,
        readingStatus: isComplete ? "Finished" : b.readingStatus,
        dateCompleted: isComplete ? new Date().toISOString() : b.dateCompleted
      };
    }));
    toast.success("Progress updated!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finished":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Reading Now":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Not Yet Read":
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            className={`h-3 w-3 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} 
          />
        ))}
      </div>
    );
  };

  const getReadingProgress = (book: ExtendedBook) => {
    if (!book.totalPages) return 0;
    return Math.round(((book.currentPage || 0) / book.totalPages) * 100);
  };

  const tabItems = [
    { value: "all", label: `All Books (${books.length})`, gradient: "from-slate-500 via-gray-500 to-zinc-500" },
    { value: "Not Yet Read", label: `Want to Read (${stats.wantToRead})`, gradient: "from-slate-500 via-zinc-500 to-gray-500" },
    { value: "Reading Now", label: `Reading (${stats.reading})`, gradient: "from-amber-500 via-orange-500 to-red-500" },
    { value: "Finished", label: `Completed (${stats.completed})`, gradient: "from-emerald-500 via-green-500 to-teal-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Library className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-slate-400">Total Books</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <BookMarked className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.reading}</p>
              <p className="text-xs text-slate-400">Reading Now</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Star className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.avgRating}</p>
              <p className="text-xs text-slate-400">Avg Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reading Goal Progress */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-orange-500">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Reading Goal</h3>
                <p className="text-sm text-slate-400">{stats.completed} of {readingGoal} books this year</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={readingGoal}
                onChange={(e) => setReadingGoal(parseInt(e.target.value) || 12)}
                className="w-20 h-8 text-center bg-slate-800/50 border-slate-700 text-white"
                min={1}
              />
              <span className="text-sm text-slate-400">books</span>
            </div>
          </div>
          <Progress 
            value={Math.min((stats.completed / readingGoal) * 100, 100)} 
            className="h-3 bg-slate-800/50" 
          />
          <p className="text-xs text-slate-400 mt-2">
            {Math.round((stats.completed / readingGoal) * 100)}% complete • {readingGoal - stats.completed} books to go
          </p>
        </CardContent>
      </Card>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search books..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-10 bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-400" 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("grid")} 
            className={viewMode === "grid" ? "bg-primary" : "bg-slate-800 border-slate-700 hover:bg-slate-700"}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("list")} 
            className={viewMode === "list" ? "bg-primary" : "bg-slate-800 border-slate-700 hover:bg-slate-700"}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => {
              setSelectedBook(null);
              setShowBookDialog(true);
            }} 
            className="bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-xl border-none"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <ModernTabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
        <ModernTabsList className="grid w-full grid-cols-4">
          {tabItems.map(tab => (
            <ModernTabsTrigger key={tab.value} value={tab.value} gradient={tab.gradient}>
              {tab.label}
            </ModernTabsTrigger>
          ))}
        </ModernTabsList>
        
        <ModernTabsContent value={activeFilter} className="mt-6">
          {filteredBooks.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No books found"
              description={
                searchTerm 
                  ? "Try adjusting your search terms or add a new book to your library." 
                  : "Start building your digital library by adding your first book."
              }
              action={
                <Button 
                  className="mt-4 bg-primary hover:bg-primary/90" 
                  onClick={() => {
                    setSelectedBook(null);
                    setShowBookDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              }
            />
          ) : (
            <div className={cn(
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-4"
            )}>
              {filteredBooks.map(book => (
                <Card 
                  key={book.id} 
                  className={cn(
                    "relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl backdrop-blur-sm group hover:shadow-2xl transition-all duration-300",
                    viewMode === "grid" ? "hover:scale-[1.02]" : ""
                  )}
                >
                  <CardHeader className="pb-3">
                    {/* Book Cover Placeholder */}
                    <div className="relative">
                      <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/30 rounded-lg mb-3 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/40 transition-all overflow-hidden">
                        {book.coverImage ? (
                          <img 
                            src={book.coverImage} 
                            alt={book.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="h-16 w-16 text-primary/60" />
                        )}
                      </div>
                      {/* Reading progress overlay for books being read */}
                      {book.readingStatus === "Reading Now" && book.totalPages && (
                        <div className="absolute bottom-3 left-0 right-0 px-2">
                          <div className="bg-slate-900/90 rounded-lg p-2 backdrop-blur-sm">
                            <div className="flex justify-between text-xs text-slate-300 mb-1">
                              <span>{book.currentPage || 0} pages</span>
                              <span>{getReadingProgress(book)}%</span>
                            </div>
                            <Progress value={getReadingProgress(book)} className="h-1.5" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <CardTitle className="text-base font-semibold line-clamp-2 leading-tight text-white">
                      {book.title}
                    </CardTitle>
                    <p className="text-sm text-slate-400 line-clamp-1">{book.author}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={`${getStatusColor(book.readingStatus)} border`} variant="secondary">
                        {book.readingStatus}
                      </Badge>
                    </div>
                    
                    {book.rating > 0 && (
                      <div className="flex items-center gap-2">
                        {renderStars(book.rating)}
                        <span className="text-xs text-slate-400">({book.rating}/5)</span>
                      </div>
                    )}
                    
                    {book.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {book.description}
                      </p>
                    )}

                    {/* Quotes preview */}
                    {book.quotes && book.quotes.length > 0 && (
                      <div className="p-2 bg-slate-800/30 rounded-lg border border-slate-700/30">
                        <div className="flex items-center gap-1 mb-1">
                          <Quote className="h-3 w-3 text-primary" />
                          <span className="text-xs text-slate-400">Favorite Quote</span>
                        </div>
                        <p className="text-xs text-slate-300 italic line-clamp-2">
                          "{book.quotes[0]}"
                        </p>
                      </div>
                    )}
                    
                    {book.relatedSkillsets && book.relatedSkillsets.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {book.relatedSkillsets.slice(0, 2).map(skillset => (
                          <Badge key={skillset} variant="outline" className="text-xs border-slate-600 text-slate-300">
                            {skillset}
                          </Badge>
                        ))}
                        {book.relatedSkillsets.length > 2 && (
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                            +{book.relatedSkillsets.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2 border-t border-slate-700/30">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBook(book);
                          setShowBookDialog(true);
                        }}
                        className="flex-1 border-slate-600/50 hover:bg-slate-700/50 text-slate-300 hover:text-white text-xs"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="icon"
                        variant="outline"
                        onClick={() => handleDeleteBook(book.id)}
                        className="border-red-600/50 hover:bg-red-600/20 hover:border-red-500/50 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ModernTabsContent>
      </ModernTabs>

      <BookDialog 
        open={showBookDialog} 
        onOpenChange={setShowBookDialog} 
        book={selectedBook} 
        onSave={handleSaveBook} 
        onDelete={handleDeleteBook} 
        coverImage={coverImage} 
        onCoverImageChange={setCoverImage} 
      />
    </div>
  );
};

export default BookshelfTab;
