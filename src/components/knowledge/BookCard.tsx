
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Calendar, User, BookOpen, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: any;
  onEdit: (book: any) => void;
  onDelete: (id: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "reading": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "want-to-read": return "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "reading": return "Currently Reading";
      case "want-to-read": return "Want to Read";
      default: return status;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= rating
                ? "fill-lime-400 text-lime-400"
                : "text-gray-300 dark:text-gray-600"
            )}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          ({rating}/5)
        </span>
      </div>
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{book.author}</span>
            </div>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(book)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(book.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Badge className={getStatusColor(book.status)}>
            {getStatusText(book.status)}
          </Badge>
          
          {book.category && (
            <Badge variant="outline" className="ml-2">
              {book.category}
            </Badge>
          )}
        </div>

        {book.rating && book.rating > 0 && (
          <div>
            {renderStars(book.rating)}
          </div>
        )}

        {book.notes && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {book.notes}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{book.pages ? `${book.pages} pages` : "No page count"}</span>
          </div>
          
          {book.dateCompleted && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(book.dateCompleted).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
