
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Calendar, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

interface Affirmation {
  id: string;
  text: string;
  category: string;
  createdAt: Date;
  lastEditedAt: Date;
  completed: boolean;
}

const AffirmationsSection = () => {
  const { toast } = useToast();
  const [affirmations, setAffirmations] = useState<Affirmation[]>(() => {
    const saved = localStorage.getItem('mindset-affirmations');
    return saved ? JSON.parse(saved) : [
      {
        id: uuidv4(),
        text: 'I am capable of achieving my goals through consistent effort.',
        category: 'Self-Confidence',
        createdAt: new Date(),
        lastEditedAt: new Date(),
        completed: false
      },
      {
        id: uuidv4(),
        text: 'Each day I am becoming a better version of myself.',
        category: 'Growth',
        createdAt: new Date(),
        lastEditedAt: new Date(),
        completed: false
      }
    ];
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    localStorage.setItem('mindset-affirmations', JSON.stringify(affirmations));
  }, [affirmations]);

  const handleAddAffirmation = () => {
    setCurrentAffirmation(null);
    setNewText('');
    setNewCategory('');
    setIsDialogOpen(true);
  };

  const handleEditAffirmation = (affirmation: Affirmation) => {
    setCurrentAffirmation(affirmation);
    setNewText(affirmation.text);
    setNewCategory(affirmation.category);
    setIsDialogOpen(true);
  };

  const handleDeleteAffirmation = (id: string) => {
    setAffirmations(affirmations.filter(affirmation => affirmation.id !== id));
    toast({
      title: "Affirmation Deleted",
      description: "Your affirmation has been removed."
    });
  };

  const handleToggleComplete = (id: string) => {
    setAffirmations(affirmations.map(affirmation => 
      affirmation.id === id 
        ? { ...affirmation, completed: !affirmation.completed } 
        : affirmation
    ));
  };

  const handleSaveAffirmation = () => {
    if (!newText.trim()) {
      toast({
        title: "Required Field Missing",
        description: "Please enter an affirmation text.",
        variant: "destructive"
      });
      return;
    }

    if (currentAffirmation) {
      // Edit existing affirmation
      setAffirmations(affirmations.map(affirmation => 
        affirmation.id === currentAffirmation.id 
          ? { 
              ...affirmation, 
              text: newText, 
              category: newCategory, 
              lastEditedAt: new Date() 
            } 
          : affirmation
      ));
      toast({
        title: "Affirmation Updated",
        description: "Your affirmation has been updated."
      });
    } else {
      // Add new affirmation
      const newAffirmation: Affirmation = {
        id: uuidv4(),
        text: newText,
        category: newCategory,
        createdAt: new Date(),
        lastEditedAt: new Date(),
        completed: false
      };
      setAffirmations([...affirmations, newAffirmation]);
      toast({
        title: "Affirmation Added",
        description: "Your new affirmation has been added."
      });
    }

    setIsDialogOpen(false);
  };

  // Reset completion status every day at midnight
  useEffect(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const lastReset = Number(localStorage.getItem('mindset-affirmations-last-reset')) || 0;
    
    if (today > lastReset) {
      setAffirmations(prev => prev.map(affirmation => ({ ...affirmation, completed: false })));
      localStorage.setItem('mindset-affirmations-last-reset', today.toString());
    }
  }, []);

  const categories = [...new Set(affirmations.map(a => a.category).filter(Boolean))];
  const completedCount = affirmations.filter(a => a.completed).length;
  const totalCount = affirmations.length;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daily Affirmations</CardTitle>
            <CardDescription>Reinforce positive beliefs and mindset</CardDescription>
          </div>
          <Button onClick={handleAddAffirmation}>
            <Plus className="h-4 w-4 mr-2" />
            Add Affirmation
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-secondary/20 rounded-lg p-3 flex justify-between items-center">
            <div className="text-sm">
              <p>Today's progress: <span className="font-bold">{completedCount}/{totalCount} affirmed</span></p>
            </div>
            <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500" 
                style={{ width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {affirmations.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No affirmations defined yet. Add your first one!
            </div>
          ) : (
            <>
              {categories.length > 0 && categories.map(category => (
                <div key={category} className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase">{category || 'Uncategorized'}</h3>
                  
                  {affirmations
                    .filter(a => a.category === category)
                    .map(affirmation => (
                      <Card 
                        key={affirmation.id} 
                        className={`bg-gradient-to-r ${affirmation.completed ? 'from-green-500/20 to-green-500/10' : 'from-orange-500/10 to-orange-500/5'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3 flex-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleComplete(affirmation.id)}
                                className={`mt-1 ${affirmation.completed ? 'text-green-500' : 'text-muted-foreground'}`}
                              >
                                <CheckCircle2 className="h-5 w-5" />
                              </Button>
                              <p className={`${affirmation.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {affirmation.text}
                              </p>
                            </div>
                            <div className="flex space-x-1 ml-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditAffirmation(affirmation)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteAffirmation(affirmation.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center mt-3 text-xs text-muted-foreground ml-8">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Last edited: {format(new Date(affirmation.lastEditedAt), 'MMM d, yyyy')}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  }
                </div>
              ))}

              {/* Uncategorized affirmations */}
              {affirmations.filter(a => !a.category).length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase">Uncategorized</h3>
                  
                  {affirmations
                    .filter(a => !a.category)
                    .map(affirmation => (
                      <Card 
                        key={affirmation.id} 
                        className={`bg-gradient-to-r ${affirmation.completed ? 'from-green-500/20 to-green-500/10' : 'from-orange-500/10 to-orange-500/5'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3 flex-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleComplete(affirmation.id)}
                                className={`mt-1 ${affirmation.completed ? 'text-green-500' : 'text-muted-foreground'}`}
                              >
                                <CheckCircle2 className="h-5 w-5" />
                              </Button>
                              <p className={`${affirmation.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {affirmation.text}
                              </p>
                            </div>
                            <div className="flex space-x-1 ml-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditAffirmation(affirmation)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteAffirmation(affirmation.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center mt-3 text-xs text-muted-foreground ml-8">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Last edited: {format(new Date(affirmation.lastEditedAt), 'MMM d, yyyy')}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  }
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAffirmation ? "Edit Affirmation" : "Add Affirmation"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="text" className="text-sm font-medium block mb-1">Affirmation</label>
              <Textarea
                id="text"
                placeholder="e.g., I am becoming stronger and healthier every day."
                rows={3}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category" className="text-sm font-medium block mb-1">Category (Optional)</label>
              <Input
                id="category"
                placeholder="e.g., Health, Career, Relationships"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              {categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground mr-1">Existing:</span>
                  {categories.map(category => (
                    <button
                      key={category}
                      type="button"
                      className="text-xs px-2 py-1 bg-secondary/30 rounded-full hover:bg-secondary/50"
                      onClick={() => setNewCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAffirmation}>Save Affirmation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AffirmationsSection;
