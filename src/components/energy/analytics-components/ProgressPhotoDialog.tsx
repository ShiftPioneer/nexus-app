
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Camera, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressPhoto } from "@/types/energy";

interface ProgressPhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (photo: ProgressPhoto) => void;
  photo?: ProgressPhoto | null;
}

export function ProgressPhotoDialog({
  open,
  onOpenChange,
  onSave,
  photo = null,
}: ProgressPhotoDialogProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);

  useEffect(() => {
    if (photo) {
      setDate(photo.date);
      setImageUrl(photo.imageUrl);
      setNotes(photo.notes || "");
      setIsPreviewing(!!photo.imageUrl);
    } else {
      resetForm();
    }
  }, [photo, open]);

  const resetForm = () => {
    setDate(new Date());
    setImageUrl("");
    setNotes("");
    setIsPreviewing(false);
  };

  const handleSave = () => {
    // In a real app, we would handle file uploads properly
    // For now, we'll just use a placeholder URL
    const photoUrl = imageUrl || "https://via.placeholder.com/300x400?text=Progress+Photo";
    
    const newPhoto: ProgressPhoto = {
      id: photo?.id || Date.now().toString(),
      date,
      imageUrl: photoUrl,
      notes,
    };

    onSave(newPhoto);
    onOpenChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      // For now, we'll create a temporary URL
      const tempUrl = URL.createObjectURL(file);
      setImageUrl(tempUrl);
      setIsPreviewing(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {photo ? "Edit Progress Photo" : "Add New Progress Photo"}
          </DialogTitle>
          <DialogDescription>
            Track your physical progress with photos
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Photo</label>
            <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md">
              {isPreviewing ? (
                <div className="space-y-4">
                  <img
                    src={imageUrl}
                    alt="Progress"
                    className="max-h-[200px] object-contain mx-auto"
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      setIsPreviewing(false);
                    }}
                    className="w-full"
                  >
                    Remove Photo
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Upload a photo</p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF up to 10MB
                    </p>
                  </div>
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </div>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this photo"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Photo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
