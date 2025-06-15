import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
interface KeyBelief {
  id: string;
  belief: string;
  explanation: string;
  createdAt: Date;
  lastEditedAt: Date;
}
const KeyBeliefsSection = () => {
  const {
    toast
  } = useToast();
  const [beliefs, setBeliefs] = useState<KeyBelief[]>(() => {
    const saved = localStorage.getItem('mindset-key-beliefs');
    return saved ? JSON.parse(saved) : [{
      id: uuidv4(),
      belief: 'Every challenge contains an opportunity',
      explanation: 'Difficulties are not just obstacles, but pathways to growth and new possibilities.',
      createdAt: new Date(),
      lastEditedAt: new Date()
    }, {
      id: uuidv4(),
      belief: 'Small consistent actions lead to big changes',
      explanation: 'The compounding effect of daily habits is more powerful than sporadic big efforts.',
      createdAt: new Date(),
      lastEditedAt: new Date()
    }];
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBelief, setCurrentBelief] = useState<KeyBelief | null>(null);
  const [newBelief, setNewBelief] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  useEffect(() => {
    localStorage.setItem('mindset-key-beliefs', JSON.stringify(beliefs));
  }, [beliefs]);
  const handleAddBelief = () => {
    setCurrentBelief(null);
    setNewBelief('');
    setNewExplanation('');
    setIsDialogOpen(true);
  };
  const handleEditBelief = (belief: KeyBelief) => {
    setCurrentBelief(belief);
    setNewBelief(belief.belief);
    setNewExplanation(belief.explanation);
    setIsDialogOpen(true);
  };
  const handleDeleteBelief = (id: string) => {
    setBeliefs(beliefs.filter(belief => belief.id !== id));
    toast({
      title: "Belief Deleted",
      description: "Your key belief has been removed."
    });
  };
  const handleSaveBelief = () => {
    if (!newBelief.trim()) {
      toast({
        title: "Required Field Missing",
        description: "Please enter a belief.",
        variant: "destructive"
      });
      return;
    }
    if (currentBelief) {
      // Edit existing belief
      setBeliefs(beliefs.map(belief => belief.id === currentBelief.id ? {
        ...belief,
        belief: newBelief,
        explanation: newExplanation,
        lastEditedAt: new Date()
      } : belief));
      toast({
        title: "Belief Updated",
        description: "Your key belief has been updated."
      });
    } else {
      // Add new belief
      const newBeliefObj: KeyBelief = {
        id: uuidv4(),
        belief: newBelief,
        explanation: newExplanation,
        createdAt: new Date(),
        lastEditedAt: new Date()
      };
      setBeliefs([...beliefs, newBeliefObj]);
      toast({
        title: "Belief Added",
        description: "Your new key belief has been added."
      });
    }
    setIsDialogOpen(false);
  };
  return <>
      <Card className="bg-slate-950">
        <CardHeader className="flex flex-row items-center justify-between bg-slate-950 rounded-lg">
          <div>
            <CardTitle>Key Beliefs</CardTitle>
            <CardDescription>Define the core ideas that shape your worldview</CardDescription>
          </div>
          <Button onClick={handleAddBelief}>
            <Plus className="h-4 w-4 mr-2" />
            Add Belief
          </Button>
        </CardHeader>
        <CardContent className="bg-slate-950 rounded-lg">
          {beliefs.length === 0 ? <div className="text-center py-6 text-muted-foreground">
              No key beliefs defined yet. Add your first one!
            </div> : <div className="space-y-4">
              {beliefs.map(belief => <Card key={belief.id} className="bg-gradient-to-r from-green-500/10 to-green-500/5">
                  <CardContent className="p-6 bg-slate-900 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{belief.belief}</h3>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditBelief(belief)} className="text-cyan-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteBelief(belief.id)} className="text-red-600">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {belief.explanation && <p className="text-sm text-muted-foreground">{belief.explanation}</p>}
                    <div className="flex items-center mt-4 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1 text-lime-600" />
                      <span className="text-lime-600">Last edited: {format(new Date(belief.lastEditedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentBelief ? "Edit Key Belief" : "Add Key Belief"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="belief" className="text-sm font-medium block mb-1">Belief Statement</label>
              <Input id="belief" placeholder="e.g., Every challenge contains an opportunity" value={newBelief} onChange={e => setNewBelief(e.target.value)} />
            </div>
            <div>
              <label htmlFor="explanation" className="text-sm font-medium block mb-1">Explanation (Optional)</label>
              <Textarea id="explanation" placeholder="Why do you hold this belief? How does it influence your actions?" rows={3} value={newExplanation} onChange={e => setNewExplanation(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBelief}>Save Belief</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
};
export default KeyBeliefsSection;