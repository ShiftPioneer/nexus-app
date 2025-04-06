
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "../BookCard";
import { Book, ReadingStatus } from "@/types/knowledge";
import { BookshelfState } from "./BookshelfTab";

interface BookshelfKanbanViewProps {
  booksByStatus: BookshelfState;
  setBooksByStatus: React.Dispatch<React.SetStateAction<BookshelfState>>;
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
          <CardContent className="p-4 bg-orange-50 py-[26px] px-[26px]">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-bold text-lg text-secondary-light">{status}</h3>
              <span className="bg-orange-100 rounded-full px-2 py-0.5 text-xs text-orange-800">
                {books.length}
              </span>
            </div>
            
            <div className="space-y-4 min-h-[150px]">
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
