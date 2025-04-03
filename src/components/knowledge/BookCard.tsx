import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "@/types/knowledge";
import { Edit, Trash2, Star } from "lucide-react";
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
    return <div className="flex gap-1">
        {[...Array(5)].map((_, i) => <Star key={i} className={cn("h-3 w-3", i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />)}
      </div>;
  };
  if (listView) {
    return <Card className="overflow-hidden bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {book.coverImage && <div className="flex-shrink-0">
                <img src={book.coverImage} alt={`${book.title} cover`} className="h-16 w-12 object-cover rounded-sm" />
              </div>}
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                </div>
                <div className="flex items-center">
                  <span className={cn("text-xs px-2 py-1 rounded-full mr-2", book.readingStatus === "Reading Now" ? "bg-blue-100 text-blue-800" : book.readingStatus === "Finished" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800")}>
                    {book.readingStatus}
                  </span>
                  {renderRatingStars(book.rating)}
                </div>
              </div>
              
              {book.description && <p className="text-sm mt-2 line-clamp-1">{book.description}</p>}
              
              {book.relatedSkillsets && book.relatedSkillsets.length > 0 && <div className="flex gap-1 mt-2 flex-wrap">
                  {book.relatedSkillsets.map(skillset => <span key={skillset} className="text-xs bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">
                      {skillset}
                    </span>)}
                </div>}
            </div>
            
            <div className="flex-shrink-0 flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => onEdit(book)} className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(book)} className="h-8 w-8 p-0 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="overflow-hidden bg-orange-50/90 border-orange-200 h-[200px] py-[15px]">
      <CardContent className="p-0">
        <div className="relative h-full">
          <div className="absolute inset-0 p-3 flex flex-col h-full">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm line-clamp-2 text-slate-950">{book.title}</h3>
                <div className="flex flex-shrink-0 gap-0.5">
                  <Button variant="ghost" size="sm" onClick={e => {
                  e.stopPropagation();
                  onEdit(book);
                }} className="h-6 w-6 p-0 rounded-full text-purple-700">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={e => {
                  e.stopPropagation();
                  onDelete(book);
                }} className="h-6 w-6 p-0 rounded-full text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-1 text-gray-950 my-[7px]">by {book.author}</p>
              
              {renderRatingStars(book.rating)}
              
              {book.description && <p className="text-xs mt-2 line-clamp-2 text-zinc-950">{book.description}</p>}
            </div>
            
            <div className="mt-2">
              {book.relatedSkillsets && book.relatedSkillsets.length > 0 && <div className="flex gap-1 mt-auto flex-wrap">
                  {book.relatedSkillsets.slice(0, 2).map(skillset => <span key={skillset} className="text-xs bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">
                      {skillset}
                    </span>)}
                  {book.relatedSkillsets.length > 2 && <span className="text-xs bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">
                      +{book.relatedSkillsets.length - 2}
                    </span>}
                </div>}
            </div>
            
            <div className="absolute bottom-3 left-3 right-3">
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", book.readingStatus === "Reading Now" ? "bg-blue-100 text-blue-800" : book.readingStatus === "Finished" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800")}>
                {book.readingStatus}
              </span>
            </div>
            
            {book.coverImage && <div className="absolute -right-2 bottom-0 w-12 h-16 opacity-25">
                <img src={book.coverImage} alt={`${book.title} cover`} className="h-full w-full object-cover rounded-sm transform -rotate-12" />
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
}