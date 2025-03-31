
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Book, Star } from "lucide-react";
import { Book as BookType } from "@/types/knowledge";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: BookType;
  onEdit: (book: BookType) => void;
  onDelete: (book: BookType) => void;
  listView?: boolean;
}

export function BookCard({ book, onEdit, onDelete, listView = false }: BookCardProps) {
  const renderRating = () => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= book.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Reading Now':
        return "bg-blue-100 text-blue-800";
      case 'Not Yet Read':
        return "bg-gray-100 text-gray-800";
      case 'Finished':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (listView) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {book.coverImage ? (
              <div className="flex-shrink-0 w-20 h-28">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-20 h-28 bg-muted flex items-center justify-center rounded">
                <Book className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {renderRating()}
                  <span className={cn("text-xs px-2 py-1 rounded", getStatusBadgeStyle(book.readingStatus))}>
                    {book.readingStatus}
                  </span>
                </div>
              </div>
              
              {book.relatedSkillsets.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {book.relatedSkillsets.map(skill => (
                    <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              
              {book.description && (
                <p className="text-sm mt-2">{book.description}</p>
              )}
              
              {(book.summary || book.keyLessons) && (
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm border-t pt-4">
                  {book.summary && (
                    <div>
                      <p className="font-medium">Summary</p>
                      <p className="text-muted-foreground">{book.summary}</p>
                    </div>
                  )}
                  {book.keyLessons && (
                    <div>
                      <p className="font-medium">Key Lessons</p>
                      <p className="text-muted-foreground">{book.keyLessons}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
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
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {book.coverImage ? (
            <div className="flex-shrink-0 w-16 h-24">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover rounded"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-16 h-24 bg-muted flex items-center justify-center rounded">
              <Book className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="font-bold">{book.title}</h3>
            <p className="text-sm text-muted-foreground">by {book.author}</p>
            
            {book.relatedSkillsets.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {book.relatedSkillsets.map(skill => (
                  <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            )}
            
            <div className="mt-2">
              {renderRating()}
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <Button
                size="sm"
                variant="secondary"
                className={cn(
                  "h-7 px-2 text-xs",
                  book.readingStatus === "Reading Now" && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                  book.readingStatus === "Not Yet Read" && "bg-gray-100 text-gray-800 hover:bg-gray-200",
                  book.readingStatus === "Finished" && "bg-green-100 text-green-800 hover:bg-green-200"
                )}
              >
                {book.readingStatus}
              </Button>
              
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(book)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(book)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
