
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Save, Heart, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface CoreValue {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastEditedAt: Date;
}

const CoreValuesSection = () => {
  const { toast } = useToast();
  const [values, setValues] = useState<CoreValue[]>(() => {
    const saved = localStorage.getItem('mindset-core-values');
    return saved ? JSON.parse(saved) : [
      {
        id: uuidv4(),
        name: 'Integrity',
        description: 'Being honest and having strong moral principles.',
        createdAt: new Date(),
        lastEditedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Growth',
        description: 'Constantly learning and improving oneself.',
        createdAt: new Date(),
        lastEditedAt: new Date()
      }
    ];
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
      setValues(values.map(value => 
        value.id === currentValue.id 
          ? { ...value, name: newName, description: newDescription, lastEditedAt: new Date() }
          : value
      ));
      toast({
        title: "Core Value Updated",
        description: "Your core value has been updated."
      });
    } else {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Core Values</h2>
            <p className="text-slate-400">Define what matters most to you</p>
          </div>
        </div>
        <Button
          onClick={handleAddValue}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Value
        </Button>
      </motion.div>

      {/* Values Grid */}
      {values.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No core values yet</h3>
          <p className="text-slate-500 mb-4">Start by defining what matters most to you.</p>
          <Button onClick={handleAddValue} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Value
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 flex items-center justify-center border border-red-500/20">
                        <Heart className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-white">{value.name}</CardTitle>
                        <CardDescription className="text-slate-400 text-sm">Core Value</CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditValue(value)}
                        className="h-8 w-8 p-0 hover:bg-slate-700/50 text-slate-400 hover:text-cyan-400"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteValue(value.id)}
                        className="h-8 w-8 p-0 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="relative">
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {value.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>Last edited: {format(new Date(value.lastEditedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-950 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {currentValue ? "Edit Core Value" : "Add Core Value"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-1 text-slate-300">Value Name</label>
              <Input 
                id="name" 
                placeholder="e.g., Integrity, Courage, Growth" 
                value={newName} 
                onChange={e => setNewName(e.target.value)} 
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium block mb-1 text-slate-300">Description</label>
              <Textarea 
                id="description" 
                placeholder="What does this value mean to you?" 
                rows={4} 
                value={newDescription} 
                onChange={e => setNewDescription(e.target.value)} 
                className="bg-slate-800/50 border-slate-600 text-white resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSaveValue} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Value
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoreValuesSection;
