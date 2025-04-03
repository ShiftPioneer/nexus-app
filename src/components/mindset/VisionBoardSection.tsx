
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Image, X, Edit, Pencil, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';

interface VisionImage {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  timeframe?: string;
  imageFile?: File;
}

const VisionBoardSection = () => {
  const { toast } = useToast();
  const [visionImages, setVisionImages] = useState<VisionImage[]>(() => {
    const saved = localStorage.getItem('mindset-vision-board');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<VisionImage | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('mindset-vision-board', JSON.stringify(visionImages));
  }, [visionImages]);

  const handleAddImage = () => {
    setCurrentImage(null);
    setNewTitle('');
    setNewDescription('');
    setNewTimeframe('');
    setPreviewImage(null);
    setIsDialogOpen(true);
  };

  const handleEditImage = (image: VisionImage) => {
    setCurrentImage(image);
    setNewTitle(image.title);
    setNewDescription(image.description || '');
    setNewTimeframe(image.timeframe || '');
    setPreviewImage(image.imageUrl);
    setIsDialogOpen(true);
  };

  const handleDeleteImage = (id: string) => {
    // Find the image to release object URL if needed
    const imageToDelete = visionImages.find(img => img.id === id);
    if (imageToDelete && imageToDelete.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageToDelete.imageUrl);
    }
    
    setVisionImages(visionImages.filter(image => image.id !== id));
    toast({
      title: "Vision Image Deleted",
      description: "Image has been removed from your vision board."
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file.",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleSaveImage = () => {
    if (!newTitle.trim() || !previewImage) {
      toast({
        title: "Required Fields Missing",
        description: "Please add both a title and image.",
        variant: "destructive"
      });
      return;
    }

    if (currentImage) {
      // Edit existing image
      setVisionImages(visionImages.map(image => 
        image.id === currentImage.id 
          ? { 
              ...image, 
              title: newTitle, 
              description: newDescription, 
              timeframe: newTimeframe,
              imageUrl: previewImage || image.imageUrl
            } 
          : image
      ));
      toast({
        title: "Vision Updated",
        description: "Your vision board item has been updated."
      });
    } else {
      // Add new image
      const newVisionImage: VisionImage = {
        id: uuidv4(),
        imageUrl: previewImage,
        title: newTitle,
        description: newDescription,
        timeframe: newTimeframe
      };
      setVisionImages([...visionImages, newVisionImage]);
      toast({
        title: "Vision Added",
        description: "Your image has been added to the vision board."
      });
    }

    setIsDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vision Board</CardTitle>
            <CardDescription>Visualize your goals and aspirations</CardDescription>
          </div>
          <Button onClick={handleAddImage}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vision
          </Button>
        </CardHeader>
        <CardContent>
          {visionImages.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Image className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="font-medium text-muted-foreground">Your vision board is empty</h3>
              <p className="text-sm text-muted-foreground/70 mb-4">Add images that represent your goals and dreams</p>
              <Button onClick={handleAddImage}>Add Your First Vision</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visionImages.map(image => (
                <Card key={image.id} className="overflow-hidden group relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <h3 className="font-bold">{image.title}</h3>
                      {image.description && <p className="text-sm opacity-90">{image.description}</p>}
                      {image.timeframe && <p className="text-xs mt-1 opacity-75">Timeframe: {image.timeframe}</p>}
                    </div>
                    <div className="absolute top-2 right-2 space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditImage(image)}
                        className="bg-black/40 text-white hover:bg-black/60"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteImage(image.id)}
                        className="bg-black/40 text-white hover:bg-red-500/90"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <img 
                    src={image.imageUrl} 
                    alt={image.title} 
                    className="h-64 w-full object-cover"
                  />
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentImage ? "Edit Vision" : "Add to Vision Board"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {previewImage ? (
              <div className="relative">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-md" 
                />
                <Button 
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/40 text-white hover:bg-black/60"
                  onClick={() => {
                    if (previewImage && previewImage.startsWith('blob:')) {
                      URL.revokeObjectURL(previewImage);
                    }
                    setPreviewImage(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload an image</p>
                <p className="text-xs text-muted-foreground/70">PNG, JPG, GIF up to 5MB</p>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            )}
            <div>
              <label htmlFor="title" className="text-sm font-medium block mb-1">Title</label>
              <Input
                id="title"
                placeholder="What does this vision represent?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium block mb-1">Description (Optional)</label>
              <Textarea
                id="description"
                placeholder="Add details about this vision..."
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="timeframe" className="text-sm font-medium block mb-1">Timeframe (Optional)</label>
              <Input
                id="timeframe"
                placeholder="e.g., 1 year, 5 years, 2025"
                value={newTimeframe}
                onChange={(e) => setNewTimeframe(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              if (previewImage && !currentImage) {
                URL.revokeObjectURL(previewImage);
              }
              setIsDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveImage}>Save Vision</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisionBoardSection;
