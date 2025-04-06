
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "@/types/knowledge";
import { BookOpen, MoreVertical, Edit, Trash, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  listView?: boolean;
}

export function BookCard({ book, onEdit, onDelete, listView = false }: BookCardProps) {
  const progress = book.currentPage && book.totalPages 
    ? Math.round((book.currentPage / book.totalPages) * 100) 
    : 0;

  if (listView) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all">
        <CardContent className="p-0">
          <div className="flex">
            <div className="w-16 h-24 bg-gray-100 flex-shrink-0">
              {book.coverImage ? (
                <img 
                  src={book.coverImage} 
                  alt={`Cover for ${book.title}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x192?text=No+Cover';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-3 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-base line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(book)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(book)} className="text-destructive">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{book.readingStatus}</Badge>
                {book.rating > 0 && (
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < book.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                )}
              </div>
              {book.readingStatus === "In Progress" && (
                <div className="mt-2">
                  <Progress value={progress} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {book.currentPage} of {book.totalPages} pages ({progress}%)
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardContent className="p-3">
        <div className="flex gap-3">
          <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            {book.coverImage ? (
              <img 
                src={book.coverImage} 
                alt={`Cover for ${book.title}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x192?text=No+Cover';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <BookOpen className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 -mt-1 -mr-1">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(book)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(book)} className="text-destructive">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
            
            {book.readingStatus === "In Progress" && (
              <div className="mt-2">
                <Progress value={progress} className="h-1" />
                <p className="text-xs text-muted-foreground mt-1">
                  {progress}%
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
