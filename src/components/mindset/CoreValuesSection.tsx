import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Save, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
interface CoreValue {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastEditedAt: Date;
}
const CoreValuesSection = () => {
  const {
    toast
  } = useToast();
  const [values, setValues] = useState<CoreValue[]>(() => {
    const saved = localStorage.getItem('mindset-core-values');
    return saved ? JSON.parse(saved) : [{
      id: uuidv4(),
      name: 'Integrity',
      description: 'Being honest and having strong moral principles.',
      createdAt: new Date(),
      lastEditedAt: new Date()
    }, {
      id: uuidv4(),
      name: 'Growth',
      description: 'Constantly learning and improving oneself.',
      createdAt: new Date(),
      lastEditedAt: new Date()
    }];
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState<CoreValue | null>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  useEffect(() => {
    localStorage.setItem('mindset-core-values', JSON.stringify(values));
  }, [values]);
  const handleAddValue = () => {
    setCurrentValue(null);
    setNewName('');
    setNewDescription('');
    setIsDialogOpen(true);
  };
  const handleEditValue = (value: CoreValue) => {
    setCurrentValue(value);
    setNewName(value.name);
    setNewDescription(value.description);
    setIsDialogOpen(true);
  };
  const handleDeleteValue = (id: string) => {
    setValues(values.filter(value => value.id !== id));
    toast({
      title: "Core Value Deleted",
      description: "Your core value has been removed."
    });
  };
  const handleSaveValue = () => {
    if (!newName.trim()) {
      toast({
        title: "Required Field Missing",
        description: "Please enter a value name.",
        variant: "destructive"
      });
      return;
    }
    if (currentValue) {
      // Edit existing value
      setValues(values.map(value => value.id === currentValue.id ? {
        ...value,
        name: newName,
        description: newDescription,
        lastEditedAt: new Date()
      } : value));
      toast({
        title: "Core Value Updated",
        description: "Your core value has been updated."
      });
    } else {
      // Add new value
      const newValue: CoreValue = {
        id: uuidv4(),
        name: newName,
        description: newDescription,
        createdAt: new Date(),
        lastEditedAt: new Date()
      };
      setValues([...values, newValue]);
      toast({
        title: "Core Value Added",
        description: "Your new core value has been added."
      });
    }
    setIsDialogOpen(false);
  };
  return <>
      <Card className="bg-slate-950 rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between rounded-lg bg-slate-950">
          <div>
            <CardTitle>Core Values</CardTitle>
            <CardDescription>Define what matters most to you</CardDescription>
          </div>
          <Button onClick={handleAddValue}>
            <Plus className="h-4 w-4 mr-2" />
            Add Value
          </Button>
        </CardHeader>
        <CardContent className="bg-slate-950 rounded-lg">
          {values.length === 0 ? <div className="text-center py-6 text-muted-foreground">
              No core values defined yet. Add your first one!
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {values.map(value => <Card key={value.id} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 p-4 bg-deep-dark">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{value.name}</h3>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditValue(value)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteValue(value.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                    <div className="flex items-center mt-4 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Last edited: {format(new Date(value.lastEditedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </Card>)}
            </div>}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentValue ? "Edit Core Value" : "Add Core Value"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-1">Value Name</label>
              <Input id="name" placeholder="e.g., Integrity, Courage, Growth" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium block mb-1">Description</label>
              <Textarea id="description" placeholder="What does this value mean to you?" rows={4} value={newDescription} onChange={e => setNewDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveValue}>
              <Save className="h-4 w-4 mr-2" />
              Save Value
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
};
export default CoreValuesSection;