
import React from "react";
import { Book, ReadingStatus } from "@/types/knowledge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCard } from "@/components/knowledge/BookCard";

export interface BookshelfKanbanViewProps {
  booksByStatus: Record<string, Book[]>;
  setBooksByStatus: React.Dispatch<React.SetStateAction<Record<string, Book[]>>>;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export function BookshelfKanbanView({ 
  booksByStatus, 
  setBooksByStatus, 
  onEdit, 
  onDelete 
}: BookshelfKanbanViewProps) {
  const handleDragStart = (event: React.DragEvent, book: Book) => {
    event.dataTransfer.setData('book', JSON.stringify(book));
  };
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };
  
  const handleDrop = (event: React.DragEvent, status: ReadingStatus) => {
    event.preventDefault();
    const bookData = event.dataTransfer.getData('book');
    if (!bookData) return;
    try {
      const book = JSON.parse(bookData) as Book;
      if (book.readingStatus === status) return;

      // Remove the book from its current status
      const newBooksByStatus = {
        ...booksByStatus
      };
      newBooksByStatus[book.readingStatus] = booksByStatus[book.readingStatus].filter(b => b.id !== book.id);

      // Update the status and add to the new status
      book.readingStatus = status;
      newBooksByStatus[status] = [...newBooksByStatus[status], book];
      setBooksByStatus(newBooksByStatus);
    } catch (e) {
      console.error('Error parsing dragged book data', e);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(booksByStatus).map(([status, books]) => (
        <Card 
          key={status} 
          className="overflow-hidden" 
          onDragOver={handleDragOver} 
          onDrop={e => handleDrop(e, status as ReadingStatus)}
        >
          <CardHeader className="bg-muted/50 p-4">
            <CardTitle className="text-lg flex items-center justify-between">
              {status}
              <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
                {books.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4 min-h-[200px]">
              {books.map(book => (
                <div key={book.id} draggable onDragStart={e => handleDragStart(e, book)} className="cursor-move">
                  <BookCard book={book} onEdit={onEdit} onDelete={onDelete} />
                </div>
              ))}
              
              {books.length === 0 && (
                <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground">
                  No books in this category
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
