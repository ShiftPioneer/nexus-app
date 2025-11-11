import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { Plus, Search, BookOpen, Grid, List, Star } from "lucide-react";
import BookDialog from "./BookDialog";
import { Book } from "@/types/knowledge";
import { useLocalStorage } from "@/hooks/use-local-storage";
const defaultBooks: Book[] = [{
  id: "1",
  title: "Atomic Habits",
  author: "James Clear",
  readingStatus: "Finished",
  rating: 5,
  description: "A comprehensive guide to building good habits and breaking bad ones.",
  relatedSkillsets: ["Self-Improvement", "Productivity"],
  summary: "Small changes can make a big difference over time.",
  keyLessons: "Focus on systems rather than goals, make habits obvious, attractive, easy, and satisfying."
}, {
  id: "2",
  title: "The 7 Habits of Highly Effective People",
  author: "Stephen Covey",
  readingStatus: "Reading Now",
  rating: 4,
  description: "Timeless principles for personal and professional effectiveness.",
  relatedSkillsets: ["Leadership", "Business"],
  summary: "Character-based approach to personal and interpersonal effectiveness.",
  keyLessons: "Be proactive, begin with the end in mind, put first things first."
}, {
  id: "3",
  title: "Deep Work",
  author: "Cal Newport",
  readingStatus: "Not Yet Read",
  rating: 0,
  description: "Rules for focused success in a distracted world.",
  relatedSkillsets: ["Productivity", "Focus"],
  summary: "The ability to focus without distraction on cognitively demanding tasks.",
  keyLessons: "Cultivate deep work habits, eliminate shallow work, embrace boredom."
}];
const BookshelfTab = () => {
  const [books, setBooks] = useLocalStorage<Book[]>("userBooks", defaultBooks);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || book.readingStatus === activeFilter;
    return matchesSearch && matchesFilter;
  });
  const handleSaveBook = (book: Book) => {
    if (selectedBook) {
      setBooks(books.map(b => b.id === book.id ? book : b));
    } else {
      setBooks([...books, {
        ...book,
        id: Date.now().toString()
      }]);
    }
    setSelectedBook(null);
    setShowBookDialog(false);
    setCoverImage(null);
  };
  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter(b => b.id !== bookId));
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finished":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Reading Now":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Not Yet Read":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };
  const renderStars = (rating: number = 0) => {
    return <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-3 w-3 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`} />)}
      </div>;
  };
  const tabItems = [{
    value: "all",
    label: `All Books (${books.length})`,
    gradient: "from-slate-500 via-gray-500 to-zinc-500"
  }, {
    value: "Not Yet Read",
    label: `Want to Read (${books.filter(b => b.readingStatus === "Not Yet Read").length})`,
    gradient: "from-yellow-500 via-orange-500 to-red-500"
  }, {
    value: "Reading Now",
    label: `Reading (${books.filter(b => b.readingStatus === "Reading Now").length})`,
    gradient: "from-blue-500 via-indigo-500 to-purple-500"
  }, {
    value: "Finished",
    label: `Completed (${books.filter(b => b.readingStatus === "Finished").length})`,
    gradient: "from-emerald-500 via-green-500 to-teal-500"
  }];
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search books..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-400" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")} className="bg-slate-800 border-slate-700 hover:bg-slate-700">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")} className="bg-slate-800 border-slate-700 hover:bg-slate-700">
            <List className="h-4 w-4" />
          </Button>
          <Button onClick={() => {
          setSelectedBook(null);
          setShowBookDialog(true);
        }} className="bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-xl border-none">
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      <ModernTabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
        <ModernTabsList className="grid w-full grid-cols-4">
          {tabItems.map(tab => <ModernTabsTrigger key={tab.value} value={tab.value} gradient={tab.gradient}>
              {tab.label}
            </ModernTabsTrigger>)}
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
                <Button className="mt-4 bg-primary hover:bg-primary/90" onClick={() => {
                  setSelectedBook(null);
                  setShowBookDialog(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              }
            />
          ) : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBooks.map(book => <Card key={book.id} className="cursor-pointer hover:shadow-xl transition-all duration-200 group h-fit bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50 backdrop-blur-sm" onClick={() => {
            setSelectedBook(book);
            setShowBookDialog(true);
          }}>
                  <CardHeader className="pb-3">
                    <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/30 rounded-lg mb-3 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/40 transition-all">
                      <BookOpen className="h-500 w-500 text-primary/60" />
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
                    
                    {book.rating > 0 && <div className="flex items-center gap-2">
                        {renderStars(book.rating)}
                        <span className="text-xs text-slate-400">({book.rating}/5)</span>
                      </div>}
                    
                    {book.description && <p className="text-xs text-slate-400 line-clamp-2">
                        {book.description}
                      </p>}
                    
                    {book.relatedSkillsets && book.relatedSkillsets.length > 0 && <div className="flex gap-1 flex-wrap">
                        {book.relatedSkillsets.slice(0, 2).map(skillset => <Badge key={skillset} variant="outline" className="text-xs border-slate-600 text-slate-300">
                            {skillset}
                          </Badge>)}
                        {book.relatedSkillsets.length > 2 && <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                            +{book.relatedSkillsets.length - 2}
                          </Badge>}
                      </div>}
                  </CardContent>
                </Card>)}
            </div>}
        </ModernTabsContent>
      </ModernTabs>

      <BookDialog open={showBookDialog} onOpenChange={setShowBookDialog} book={selectedBook} onSave={handleSaveBook} onDelete={handleDeleteBook} coverImage={coverImage} onCoverImageChange={setCoverImage} />
    </div>;
};
export default BookshelfTab;