
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book, ReadingStatus } from "@/types/knowledge";
import { Star, MoreVertical, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  listView?: boolean;
}

export function BookCard({ book, onEdit, onDelete, listView = false }: BookCardProps) {
  const getStatusColor = (status: ReadingStatus) => {
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

  const renderRating = () => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= book.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (listView) {
    return (
      <Card className="hover:shadow transition-shadow">
        <CardContent className="p-4 flex items-start">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-16 h-24 object-cover rounded-sm shadow-sm mr-4"
            />
          ) : (
            <div className="w-16 h-24 bg-muted flex items-center justify-center rounded-sm shadow-sm mr-4">
              <span className="text-xs text-muted-foreground text-center px-1">No Cover</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-base mb-1 truncate">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
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

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="secondary" className={getStatusColor(book.readingStatus)}>
                {book.readingStatus}
              </Badge>
              {renderRating()}
            </div>

            {book.description && (
              <p className="text-xs mt-2 text-muted-foreground line-clamp-1">{book.description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className={getStatusColor(book.readingStatus)}>
            {book.readingStatus}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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

        <div className="flex items-start gap-3">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-12 h-16 object-cover rounded-sm shadow-sm"
            />
          ) : (
            <div className="w-12 h-16 bg-muted flex items-center justify-center rounded-sm shadow-sm">
              <span className="text-xs text-muted-foreground text-center px-1">No Cover</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-xs text-muted-foreground">{book.author}</p>
            {renderRating()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
