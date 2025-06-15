import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
interface Mission {
  id: string;
  title: string;
  statement: string;
  createdAt: Date;
  lastEditedAt: Date;
}
const MissionSection = () => {
  const {
    toast
  } = useToast();
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('mindset-mission-statements');
    return saved ? JSON.parse(saved) : [{
      id: uuidv4(),
      title: 'Personal Growth',
      statement: 'To continuously learn, grow, and develop myself in every aspect of life.',
      createdAt: new Date(),
      lastEditedAt: new Date()
    }];
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newStatement, setNewStatement] = useState('');
  useEffect(() => {
    localStorage.setItem('mindset-mission-statements', JSON.stringify(missions));
  }, [missions]);
  const handleAddMission = () => {
    setCurrentMission(null);
    setNewTitle('');
    setNewStatement('');
    setIsDialogOpen(true);
  };
  const handleEditMission = (mission: Mission) => {
    setCurrentMission(mission);
    setNewTitle(mission.title);
    setNewStatement(mission.statement);
    setIsDialogOpen(true);
  };
  const handleDeleteMission = (id: string) => {
    setMissions(missions.filter(mission => mission.id !== id));
    toast({
      title: "Mission Deleted",
      description: "Your mission statement has been removed."
    });
  };
  const handleSaveMission = () => {
    if (!newTitle.trim() || !newStatement.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter both a title and mission statement.",
        variant: "destructive"
      });
      return;
    }
    if (currentMission) {
      // Edit existing mission
      setMissions(missions.map(mission => mission.id === currentMission.id ? {
        ...mission,
        title: newTitle,
        statement: newStatement,
        lastEditedAt: new Date()
      } : mission));
      toast({
        title: "Mission Updated",
        description: "Your mission statement has been updated."
      });
    } else {
      // Add new mission
      const newMission: Mission = {
        id: uuidv4(),
        title: newTitle,
        statement: newStatement,
        createdAt: new Date(),
        lastEditedAt: new Date()
      };
      setMissions([...missions, newMission]);
      toast({
        title: "Mission Added",
        description: "Your new mission statement has been added."
      });
    }
    setIsDialogOpen(false);
  };
  return <>
      <Card className="rounded-lg bg-slate-950">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Mission Statement</CardTitle>
              <CardDescription>Define your purpose and direction</CardDescription>
            </div>
            <Button onClick={handleAddMission}>
              <Plus className="h-4 w-4 mr-2" />
              Add Mission
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 bg-slate-950 rounded-lg">
          {missions.length === 0 ? <div className="text-center py-6 text-muted-foreground">
              No mission statements defined yet. Add your first one!
            </div> : missions.map(mission => <Card key={mission.id} className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 bg-slate-900">
                <CardHeader className="bg-slate-900 rounded-lg">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{mission.title}</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditMission(mission)} className="text-cyan-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMission(mission.id)} className="text-red-600">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="bg-slate-900 py-[10px]">
                  <p className="italic">"<span className="text-primary">{mission.statement}</span>"</p>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground flex justify-end pt-1 rounded-lg bg-slate-900">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-lime-600" />
                    <span className="text-lime-600">Last edited: {format(new Date(mission.lastEditedAt), 'MMM d, yyyy')}</span>
                  </div>
                </CardFooter>
              </Card>)}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentMission ? "Edit Mission Statement" : "Add Mission Statement"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium block mb-1">Mission Title</label>
              <Input id="title" placeholder="e.g., Personal Growth, Career, Family" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            </div>
            <div>
              <label htmlFor="statement" className="text-sm font-medium block mb-1">Mission Statement</label>
              <Textarea id="statement" placeholder="What is your purpose in this area of life?" rows={5} value={newStatement} onChange={e => setNewStatement(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveMission}>Save Mission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
};
export default MissionSection;