
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "@/types/knowledge";
import { Edit, Trash2, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "h-3 w-3", 
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )} 
          />
        ))}
      </div>
    );
  };
  
  if (listView) {
    return (
      <Card className="overflow-hidden bg-gradient-to-r from-orange-50 to-rose-50 border-orange-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {book.coverImage ? (
              <div className="flex-shrink-0">
                <img 
                  src={book.coverImage} 
                  alt={`${book.title} cover`} 
                  className="h-16 w-12 object-cover rounded-sm shadow-md"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 h-16 w-12 bg-orange-200 rounded-sm flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-orange-700" />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{book.title}</h3>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                </div>
                <div className="flex items-center">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full mr-2", 
                    book.readingStatus === "Reading Now" ? "bg-blue-100 text-blue-800" : 
                    book.readingStatus === "Finished" ? "bg-green-100 text-green-800" : 
                    "bg-orange-100 text-orange-800"
                  )}>
                    {book.readingStatus}
                  </span>
                  {renderRatingStars(book.rating)}
                </div>
              </div>
              
              {book.description && <p className="text-sm mt-2 line-clamp-1 text-gray-700">{book.description}</p>}
              
              {book.relatedSkillsets && book.relatedSkillsets.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {book.relatedSkillsets.map(skillset => (
                    <span 
                      key={skillset} 
                      className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full"
                    >
                      {skillset}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(book)} 
                className="h-8 w-8 p-0 rounded-full hover:bg-orange-100"
              >
                <Edit className="h-4 w-4 text-orange-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(book)} 
                className="h-8 w-8 p-0 rounded-full hover:bg-red-100 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden bg-gradient-to-r from-orange-50 to-rose-50 border-orange-200 h-[220px] hover:shadow-md transition-shadow">
      <CardContent className="p-4 h-full relative">
        <div className="absolute top-0 right-0 p-2 flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(book);
            }} 
            className="h-7 w-7 p-0 rounded-full bg-white/80 hover:bg-orange-100"
          >
            <Edit className="h-3.5 w-3.5 text-orange-600" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book);
            }} 
            className="h-7 w-7 p-0 rounded-full bg-white/80 hover:bg-red-100 text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <div className="flex h-full flex-col">
          <div className="flex gap-3">
            {book.coverImage ? (
              <img 
                src={book.coverImage} 
                alt={`${book.title} cover`} 
                className="h-24 w-16 object-cover rounded-sm shadow-md"
              />
            ) : (
              <div className="h-24 w-16 bg-orange-200 rounded-sm flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-orange-700" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 line-clamp-2 text-sm">{book.title}</h3>
              <p className="text-xs text-gray-600 mt-1">by {book.author}</p>
              {renderRatingStars(book.rating)}
              
              {book.description && (
                <p className="text-xs mt-2 line-clamp-2 text-gray-700">
                  {book.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-auto">
            {book.relatedSkillsets && book.relatedSkillsets.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {book.relatedSkillsets.slice(0, 2).map(skillset => (
                  <span 
                    key={skillset} 
                    className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full"
                  >
                    {skillset}
                  </span>
                ))}
                {book.relatedSkillsets.length > 2 && (
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                    +{book.relatedSkillsets.length - 2}
                  </span>
                )}
              </div>
            )}
            
            <div className="mt-2">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full inline-block", 
                book.readingStatus === "Reading Now" ? "bg-blue-100 text-blue-800" : 
                book.readingStatus === "Finished" ? "bg-green-100 text-green-800" : 
                "bg-orange-100 text-orange-800"
              )}>
                {book.readingStatus}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
