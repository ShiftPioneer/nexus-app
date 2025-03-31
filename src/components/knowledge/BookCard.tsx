import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, BookOpen, Star } from "lucide-react";
import { Book } from "@/types/knowledge";
import { cn } from "@/lib/utils";
interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  listView?: boolean;
}
export function BookCard({
  book,
  onEdit,
  onDelete,
  listView = false
}: BookCardProps) {
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => <Star key={i} size={16} className={cn("inline", i < rating ? "fill-amber-500 text-amber-500" : "text-gray-300")} />);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reading Now":
        return "bg-blue-100 text-blue-800";
      case "Not Yet Read":
        return "bg-gray-100 text-gray-800";
      case "Finished":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  if (listView) {
    return <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="shrink-0 h-16 w-12 bg-gray-100 rounded overflow-hidden">
              {book.coverImage ? <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <BookOpen className="h-6 w-6 text-gray-500" />
                </div>}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs px-2 py-1 rounded-full", getStatusColor(book.readingStatus))}>
                    {book.readingStatus}
                  </span>
                  <div className="flex">
                    {renderStars(book.rating)}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {book.relatedSkillsets.map(skill => <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {skill}
                  </span>)}
              </div>
              
              <div className="flex justify-end gap-2 mt-2">
                <Button size="icon" variant="outline" onClick={() => onEdit(book)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => onDelete(book)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="overflow-hidden">
      <CardContent className="p-4 bg-accent-dark">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
            <span className={cn("text-xs px-2 py-0.5 rounded-full", getStatusColor(book.readingStatus))}>
              {book.readingStatus}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground">by {book.author}</p>
          
          <div className="flex mt-1">
            {renderStars(book.rating)}
          </div>
          
          <div className="mt-auto pt-2 flex justify-between items-center">
            <div className="flex gap-1">
              <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => onEdit(book)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="outline" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(book)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
}