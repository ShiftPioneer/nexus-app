import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Image, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
interface VisionItem {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: Date;
}
const VisionBoardSection = () => {
  const [visionItems, setVisionItems] = useState<VisionItem[]>(() => {
    const savedItems = localStorage.getItem('visionBoardItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();

  // Save vision items to localStorage when it changes
  React.useEffect(() => {
    localStorage.setItem('visionBoardItems', JSON.stringify(visionItems));
  }, [visionItems]);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive'
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive'
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = evt => {
      setUploadedImage(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  const handleAddItem = () => {
    if (!uploadedImage) {
      toast({
        title: 'Missing image',
        description: 'Please upload an image for your vision board',
        variant: 'destructive'
      });
      return;
    }
    const newItem: VisionItem = {
      id: uuidv4(),
      imageUrl: uploadedImage,
      caption: caption || 'My Vision',
      createdAt: new Date()
    };
    setVisionItems([...visionItems, newItem]);
    setUploadedImage(null);
    setCaption('');
    setIsAddingNewItem(false);
    toast({
      title: 'Vision added',
      description: 'Your vision has been added to the board'
    });
  };
  const handleDeleteItem = (id: string) => {
    setVisionItems(visionItems.filter(item => item.id !== id));
    toast({
      title: 'Vision removed',
      description: 'The vision has been removed from your board'
    });
  };
  const handleCancel = () => {
    setUploadedImage(null);
    setCaption('');
    setIsAddingNewItem(false);
  };
  return <div className="space-y-6">
      <Card className="bg-slate-950">
        <CardHeader className="bg-slate-950 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Vision Board</CardTitle>
              <CardDescription>
                Visualize your goals and aspirations
              </CardDescription>
            </div>
            {!isAddingNewItem && <Button onClick={() => setIsAddingNewItem(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Vision
              </Button>}
          </div>
        </CardHeader>
        <CardContent className="bg-slate-950 rounded-lg">
          {isAddingNewItem && <Card className="mb-6 border-dashed">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-center">
                  {!uploadedImage ? <div className="w-full h-48 bg-accent/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => fileInputRef.current?.click()}>
                      <Image className="h-10 w-10 text-accent/50 mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload an image</p>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </div> : <div className="relative">
                      <img src={uploadedImage} alt="Preview" className="max-h-48 rounded-lg object-cover" />
                      <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-6 w-6" onClick={() => setUploadedImage(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>}
                </div>
                
                <div>
                  <Input placeholder="Add caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem} disabled={!uploadedImage}>
                    <Check className="h-4 w-4 mr-2" />
                    Add to Board
                  </Button>
                </div>
              </CardContent>
            </Card>}

          {visionItems.length === 0 && !isAddingNewItem ? <div className="text-center py-8">
              <Image className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">Your vision board is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add images that represent your goals and aspirations
              </p>
              <Button onClick={() => setIsAddingNewItem(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Vision
              </Button>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence>
                {visionItems.map(item => <motion.div key={item.id} initial={{
              opacity: 0,
              scale: 0.8
            }} animate={{
              opacity: 1,
              scale: 1
            }} exit={{
              opacity: 0,
              scale: 0.8
            }} transition={{
              duration: 0.3
            }}>
                    <Card className="overflow-hidden">
                      <div className="relative">
                        <img src={item.imageUrl} alt={item.caption} className="w-full h-40 object-cover" />
                        <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-6 w-6 opacity-80 hover:opacity-100" onClick={() => handleDeleteItem(item.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardFooter className="p-2">
                        <p className="text-sm font-medium truncate w-full text-center">
                          {item.caption}
                        </p>
                      </CardFooter>
                    </Card>
                  </motion.div>)}
              </AnimatePresence>
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default VisionBoardSection;