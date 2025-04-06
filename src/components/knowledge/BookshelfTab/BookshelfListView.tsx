
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookCard } from "../BookCard";
import { Book } from "@/types/knowledge";
import { BookshelfState } from "./BookshelfTab";

interface BookshelfListViewProps {
  booksByStatus: BookshelfState;
  allBooks: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export function BookshelfListView({
  booksByStatus,
  allBooks,
  onEdit,
  onDelete
}: BookshelfListViewProps) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full md:w-auto">
        <TabsTrigger value="all">All Books</TabsTrigger>
        <TabsTrigger value="reading">Reading Now</TabsTrigger>
        <TabsTrigger value="toread">To Read</TabsTrigger>
        <TabsTrigger value="finished">Finished</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-4">
        <div className="space-y-4">
          {allBooks.length > 0 ? (
            allBooks.map(book => (
              <BookCard key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} listView />
            ))
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No books added yet</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="reading" className="mt-4">
        <div className="space-y-4">
          {booksByStatus["Reading Now"].length > 0 ? (
            booksByStatus["Reading Now"].map(book => (
              <BookCard key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} listView />
            ))
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No books currently being read</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="toread" className="mt-4">
        <div className="space-y-4">
          {booksByStatus["Not Yet Read"].length > 0 ? (
            booksByStatus["Not Yet Read"].map(book => (
              <BookCard key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} listView />
            ))
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">Your reading list is empty</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="finished" className="mt-4">
        <div className="space-y-4">
          {booksByStatus["Finished"].length > 0 ? (
            booksByStatus["Finished"].map(book => (
              <BookCard key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} listView />
            ))
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No finished books yet</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
