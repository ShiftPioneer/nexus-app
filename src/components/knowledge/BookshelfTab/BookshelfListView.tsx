
import React from "react";
import { Book } from "@/types/knowledge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash, Star, Clock, BookOpen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface BookshelfListViewProps {
  booksByStatus: Record<string, Book[]>;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  allBooks: Book[];
}

export function BookshelfListView({ booksByStatus, onEdit, onDelete, allBooks }: BookshelfListViewProps) {
  return (
    <div className="space-y-4">
      {allBooks && allBooks.length > 0 ? (
        allBooks.map(book => (
          <Card key={book.id} className="overflow-hidden hover:shadow-md transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-24 h-32 md:h-full bg-gray-100 flex-shrink-0">
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
                      <BookOpen className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4 w-full flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge>{book.readingStatus}</Badge>
                    {book.genre && <Badge variant="outline">{book.genre}</Badge>}
                    {book.rating > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {book.rating}/5
                      </Badge>
                    )}
                  </div>
                  
                  {book.description && (
                    <p className="text-sm mt-2 line-clamp-2">{book.description}</p>
                  )}
                  
                  <div className="mt-auto pt-2 text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Added: {new Date(book.dateAdded).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No books in this list</p>
        </div>
      )}
    </div>
  );
}
