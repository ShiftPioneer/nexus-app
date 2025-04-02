
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Sparkles, 
  Quote, 
  Star, 
  Trash, 
  PencilLine, 
  Calendar, 
  Plus,
  CheckCircle,
  Image,
  Upload,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Types for Mindset features
interface CoreValue {
  id: string;
  value: string;
  description: string;
  createdAt: Date;
}

interface MissionStatement {
  id: string;
  statement: string;
  createdAt: Date;
}

interface KeyBelief {
  id: string;
  belief: string;
  category: string;
  createdAt: Date;
}

interface Affirmation {
  id: string;
  text: string;
  category: string;
  createdAt: Date;
}

interface VisionItem {
  id: string;
  title: string;
  imageUrl?: string;
  note?: string;
  createdAt: Date;
}

const PROMPTS = [
  "What steps can you take today to align with your core values?",
  "How can you embody your mission statement in your actions today?",
  "Which of your beliefs can help you overcome today's challenges?",
  "What are you grateful for, and how can you express that gratitude today?",
  "How can you turn today's challenges into opportunities for growth?",
  "What would make today meaningful for you?",
  "How might you contribute positively to someone else's day?",
  "What small step can you take toward a big goal today?",
  "How can you practice self-compassion today?",
  "What is one thing you can learn or practice today?"
];

const Mindset = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("core-values");
  const [dailyPrompt, setDailyPrompt] = useState("");
  
  // Core Values state
  const [coreValues, setCoreValues] = useState<CoreValue[]>(() => {
    const saved = localStorage.getItem("mindset-core-values");
    return saved ? JSON.parse(saved) : [
      { id: "cv-1", value: "Growth", description: "Continuous learning and improvement", createdAt: new Date("2023-06-15") },
      { id: "cv-2", value: "Balance", description: "Maintaining harmony in all areas of life", createdAt: new Date("2023-07-20") }
    ];
  });
  const [newCoreValue, setNewCoreValue] = useState("");
  const [newCoreValueDesc, setNewCoreValueDesc] = useState("");
  
  // Mission Statements state
  const [missions, setMissions] = useState<MissionStatement[]>(() => {
    const saved = localStorage.getItem("mindset-missions");
    return saved ? JSON.parse(saved) : [
      { id: "ms-1", statement: "To live a purposeful life by continuously growing, maintaining balance, and acting with integrity.", createdAt: new Date("2023-06-15") }
    ];
  });
  const [newMission, setNewMission] = useState("");
  
  // Key Beliefs state
  const [beliefs, setBeliefs] = useState<KeyBelief[]>(() => {
    const saved = localStorage.getItem("mindset-beliefs");
    return saved ? JSON.parse(saved) : [
      { id: "b-1", belief: "Challenges are opportunities for growth", category: "success", createdAt: new Date("2023-06-15") },
      { id: "b-2", belief: "I have the power to create positive change", category: "personal", createdAt: new Date("2023-07-20") },
      { id: "b-3", belief: "Every experience offers valuable lessons", category: "growth", createdAt: new Date("2023-08-10") }
    ];
  });
  const [newBelief, setNewBelief] = useState("");
  const [beliefCategory, setBeliefCategory] = useState("personal");
  
  // Affirmations state
  const [affirmations, setAffirmations] = useState<Affirmation[]>(() => {
    const saved = localStorage.getItem("mindset-affirmations");
    return saved ? JSON.parse(saved) : [
      { id: "a-1", text: "I am capable of achieving my goals", category: "confidence", createdAt: new Date("2023-06-15") },
      { id: "a-2", text: "I embrace challenges as opportunities", category: "resilience", createdAt: new Date("2023-07-20") },
      { id: "a-3", text: "I am grateful for everything in my life", category: "gratitude", createdAt: new Date("2023-08-10") }
    ];
  });
  const [newAffirmation, setNewAffirmation] = useState("");
  const [affirmationCategory, setAffirmationCategory] = useState("confidence");
  
  // Vision Board state
  const [visionItems, setVisionItems] = useState<VisionItem[]>(() => {
    const saved = localStorage.getItem("mindset-vision-items");
    return saved ? JSON.parse(saved) : [];
  });
  
  // Vision Board dialog state
  const [visionDialogOpen, setVisionDialogOpen] = useState(false);
  const [newVisionTitle, setNewVisionTitle] = useState("");
  const [newVisionNote, setNewVisionNote] = useState("");
  const [newVisionImage, setNewVisionImage] = useState<File | null>(null);
  const [newVisionImagePreview, setNewVisionImagePreview] = useState<string | null>(null);
  
  // Edit states
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  
  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("mindset-core-values", JSON.stringify(coreValues));
    localStorage.setItem("mindset-missions", JSON.stringify(missions));
    localStorage.setItem("mindset-beliefs", JSON.stringify(beliefs));
    localStorage.setItem("mindset-affirmations", JSON.stringify(affirmations));
    localStorage.setItem("mindset-vision-items", JSON.stringify(visionItems));
  }, [coreValues, missions, beliefs, affirmations, visionItems]);
  
  // Set daily prompt on component mount
  useEffect(() => {
    // Get a random prompt
    const randomIndex = Math.floor(Math.random() * PROMPTS.length);
    setDailyPrompt(PROMPTS[randomIndex]);
    
    // Check if we've already set a prompt today
    const today = new Date().toDateString();
    const lastPromptDate = localStorage.getItem("mindset-last-prompt-date");
    const savedPrompt = localStorage.getItem("mindset-daily-prompt");
    
    if (lastPromptDate === today && savedPrompt) {
      setDailyPrompt(savedPrompt);
    } else {
      localStorage.setItem("mindset-last-prompt-date", today);
      localStorage.setItem("mindset-daily-prompt", PROMPTS[randomIndex]);
    }
  }, []);
  
  const getNewPrompt = () => {
    const currentIndex = PROMPTS.indexOf(dailyPrompt);
    const nextIndex = (currentIndex + 1) % PROMPTS.length;
    setDailyPrompt(PROMPTS[nextIndex]);
    localStorage.setItem("mindset-daily-prompt", PROMPTS[nextIndex]);
  };
  
  // Core Values handlers
  const addCoreValue = () => {
    if (!newCoreValue.trim()) {
      toast({ title: "Error", description: "Core value cannot be empty", variant: "destructive" });
      return;
    }
    
    const newValue = {
      id: `cv-${Date.now()}`,
      value: newCoreValue,
      description: newCoreValueDesc,
      createdAt: new Date()
    };
    
    setCoreValues([...coreValues, newValue]);
    setNewCoreValue("");
    setNewCoreValueDesc("");
    
    toast({
      title: "Core Value Added",
      description: `${newCoreValue} has been added to your core values.`
    });
  };
  
  const removeCoreValue = (id: string) => {
    setCoreValues(coreValues.filter(value => value.id !== id));
    toast({
      title: "Core Value Removed",
      description: "The core value has been removed."
    });
  };
  
  // Mission Statement handlers
  const addMission = () => {
    if (!newMission.trim()) {
      toast({ title: "Error", description: "Mission statement cannot be empty", variant: "destructive" });
      return;
    }
    
    const newMissionItem = {
      id: `ms-${Date.now()}`,
      statement: newMission,
      createdAt: new Date()
    };
    
    setMissions([...missions, newMissionItem]);
    setNewMission("");
    
    toast({
      title: "Mission Statement Added",
      description: "Your mission statement has been added."
    });
  };
  
  const removeMission = (id: string) => {
    setMissions(missions.filter(mission => mission.id !== id));
    toast({
      title: "Mission Statement Removed",
      description: "The mission statement has been removed."
    });
  };
  
  // Beliefs handlers
  const addBelief = () => {
    if (!newBelief.trim()) {
      toast({ title: "Error", description: "Belief statement cannot be empty", variant: "destructive" });
      return;
    }
    
    const newBeliefItem = {
      id: `b-${Date.now()}`,
      belief: newBelief,
      category: beliefCategory,
      createdAt: new Date()
    };
    
    setBeliefs([...beliefs, newBeliefItem]);
    setNewBelief("");
    
    toast({
      title: "Belief Added",
      description: "Your belief has been added."
    });
  };
  
  const removeBelief = (id: string) => {
    setBeliefs(beliefs.filter(belief => belief.id !== id));
    toast({
      title: "Belief Removed",
      description: "The belief has been removed."
    });
  };
  
  // Affirmations handlers
  const addAffirmation = () => {
    if (!newAffirmation.trim()) {
      toast({ title: "Error", description: "Affirmation cannot be empty", variant: "destructive" });
      return;
    }
    
    const newAffirmationItem = {
      id: `a-${Date.now()}`,
      text: newAffirmation,
      category: affirmationCategory,
      createdAt: new Date()
    };
    
    setAffirmations([...affirmations, newAffirmationItem]);
    setNewAffirmation("");
    
    toast({
      title: "Affirmation Added",
      description: "Your affirmation has been added."
    });
  };
  
  const removeAffirmation = (id: string) => {
    setAffirmations(affirmations.filter(affirmation => affirmation.id !== id));
    toast({
      title: "Affirmation Removed",
      description: "The affirmation has been removed."
    });
  };
  
  // Vision Board handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewVisionImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewVisionImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addVisionItem = () => {
    if (!newVisionTitle.trim()) {
      toast({ title: "Error", description: "Vision item title cannot be empty", variant: "destructive" });
      return;
    }
    
    // Create vision item
    const newItem: VisionItem = {
      id: `v-${Date.now()}`,
      title: newVisionTitle,
      note: newVisionNote || undefined,
      createdAt: new Date()
    };
    
    // Handle image if provided
    if (newVisionImage && newVisionImagePreview) {
      newItem.imageUrl = newVisionImagePreview;
    }
    
    setVisionItems([...visionItems, newItem]);
    resetVisionForm();
    
    toast({
      title: "Vision Item Added",
      description: "Your vision board item has been added."
    });
  };
  
  const resetVisionForm = () => {
    setNewVisionTitle("");
    setNewVisionNote("");
    setNewVisionImage(null);
    setNewVisionImagePreview(null);
    setVisionDialogOpen(false);
  };
  
  const removeVisionItem = (id: string) => {
    setVisionItems(visionItems.filter(item => item.id !== id));
    toast({
      title: "Vision Item Removed",
      description: "The vision item has been removed."
    });
  };
  
  // Edit handlers
  const openEditDialog = (type: string, id: string) => {
    setEditingItem(`${type}-${id}`);
    
    if (type === "core-value") {
      const value = coreValues.find(v => v.id === id);
      if (value) {
        setEditValue(value.value);
        setEditDescription(value.description);
      }
    } else if (type === "mission") {
      const mission = missions.find(m => m.id === id);
      if (mission) {
        setEditValue(mission.statement);
      }
    } else if (type === "belief") {
      const belief = beliefs.find(b => b.id === id);
      if (belief) {
        setEditValue(belief.belief);
        setEditCategory(belief.category);
      }
    } else if (type === "affirmation") {
      const affirmation = affirmations.find(a => a.id === id);
      if (affirmation) {
        setEditValue(affirmation.text);
        setEditCategory(affirmation.category);
      }
    }
    
    setEditDialogOpen(true);
  };
  
  const saveEdit = () => {
    if (!editingItem) return;
    
    const [type, id] = editingItem.split('-');
    
    if (type === "core") {
      setCoreValues(coreValues.map(value => 
        value.id === id ? { ...value, value: editValue, description: editDescription } : value
      ));
    } else if (type === "ms") {
      setMissions(missions.map(mission => 
        mission.id === id ? { ...mission, statement: editValue } : mission
      ));
    } else if (type === "b") {
      setBeliefs(beliefs.map(belief => 
        belief.id === id ? { ...belief, belief: editValue, category: editCategory } : belief
      ));
    } else if (type === "a") {
      setAffirmations(affirmations.map(affirmation => 
        affirmation.id === id ? { ...affirmation, text: editValue, category: editCategory } : affirmation
      ));
    }
    
    setEditDialogOpen(false);
    setEditingItem(null);
    setEditValue("");
    setEditDescription("");
    setEditCategory("");
    
    toast({
      title: "Item Updated",
      description: "Your mindset item has been updated."
    });
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6 text-[#FF6500]" />
              Mindset OS
            </h1>
            <p className="text-muted-foreground">Develop your mindset, affirmations, and beliefs</p>
          </div>
          <Button 
            onClick={() => setVisionDialogOpen(true)} 
            className="gap-2 bg-[#FF6500] hover:bg-[#FF6500]/90"
          >
            <Sparkles size={18} />
            Vision Board
          </Button>
        </div>
        
        <Card className="border-blue-700 bg-blue-900/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-3">
                <Quote className="h-8 w-8 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-medium mb-1">Today's Mindset Prompt</h2>
                  <p className="text-lg text-blue-100">{dailyPrompt}</p>
                </div>
              </div>
              <Button onClick={getNewPrompt} className="bg-blue-700 hover:bg-blue-800">
                New Prompt
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="bg-slate-800">
              <TabsTrigger value="core-values">Core Values</TabsTrigger>
              <TabsTrigger value="mission-statements">Mission Statements</TabsTrigger>
              <TabsTrigger value="beliefs">Beliefs</TabsTrigger>
              <TabsTrigger value="affirmations">Affirmations</TabsTrigger>
              <TabsTrigger value="vision-board">Vision Board</TabsTrigger>
            </TabsList>
          </div>
          
          <Card className="border-slate-700">
            <TabsContent value="core-values" className="m-0">
              <CardHeader>
                <CardTitle>Core Values</CardTitle>
                <CardDescription>Define the principles that guide your life and decisions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {coreValues.map(value => (
                    <div key={value.id} className="p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <h3 className="text-lg font-medium">{value.value}</h3>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog('core-value', value.id)}
                          >
                            <PencilLine className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeCoreValue(value.id)}
                          >
                            <Trash className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2 text-muted-foreground">{value.description}</p>
                      <div className="mt-3 flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Created: {formatDate(new Date(value.createdAt))}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Card className="border-dashed border-slate-600">
                  <CardHeader>
                    <CardTitle>Add New Core Value</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Input 
                        placeholder="Enter a core value" 
                        value={newCoreValue}
                        onChange={e => setNewCoreValue(e.target.value)}
                      />
                    </div>
                    <div>
                      <Textarea 
                        placeholder="Describe what this value means to you"
                        value={newCoreValueDesc}
                        onChange={e => setNewCoreValueDesc(e.target.value)}
                        className="h-20 resize-none"
                      />
                    </div>
                    <Button onClick={addCoreValue} className="w-full">Add Value</Button>
                  </CardContent>
                </Card>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="mission-statements" className="m-0">
              <CardHeader>
                <CardTitle>Personal Mission Statements</CardTitle>
                <CardDescription>Define your purpose and what you stand for</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {missions.map(mission => (
                    <div key={mission.id} className="p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                      <div className="flex justify-between items-start">
                        <p className="text-lg italic">"{mission.statement}"</p>
                        <div className="flex gap-2 flex-shrink-0 ml-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog('mission', mission.id)}
                          >
                            <PencilLine className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeMission(mission.id)}
                          >
                            <Trash className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Created: {formatDate(new Date(mission.createdAt))}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Add New Mission Statement</h3>
                  <Textarea 
                    placeholder="Enter your personal mission statement"
                    value={newMission}
                    onChange={e => setNewMission(e.target.value)}
                    className="h-24 resize-none"
                  />
                  <Button onClick={addMission} className="w-full">Add Mission Statement</Button>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="beliefs" className="m-0">
              <CardHeader>
                <CardTitle>Key Beliefs</CardTitle>
                <CardDescription>Document the beliefs that shape your thoughts and actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {beliefs.map(belief => (
                    <div key={belief.id} className="p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{belief.belief}</h3>
                          <div className="mt-1">
                            <span className="px-2 py-1 text-xs rounded-full bg-slate-700 text-slate-300">
                              {belief.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog('belief', belief.id)}
                          >
                            <PencilLine className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeBelief(belief.id)}
                          >
                            <Trash className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Created: {formatDate(new Date(belief.createdAt))}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-slate-700">
                  <h3 className="text-lg font-medium mb-4">New Belief</h3>
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Enter a new belief statement"
                      value={newBelief}
                      onChange={e => setNewBelief(e.target.value)}
                      className="h-20 resize-none"
                    />
                    
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Category</label>
                      <Select value={beliefCategory} onValueChange={setBeliefCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="growth">Growth</SelectItem>
                          <SelectItem value="relationships">Relationships</SelectItem>
                          <SelectItem value="abundance">Abundance</SelectItem>
                          <SelectItem value="purpose">Purpose</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={addBelief}>Add Belief</Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="affirmations" className="m-0">
              <CardHeader>
                <CardTitle>Daily Affirmations</CardTitle>
                <CardDescription>Create positive statements to reinforce your beliefs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {affirmations.map(affirmation => (
                    <div key={affirmation.id} className="p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            {affirmation.text}
                          </h3>
                          <div className="mt-1">
                            <span className="px-2 py-1 text-xs rounded-full bg-slate-700 text-slate-300">
                              {affirmation.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog('affirmation', affirmation.id)}
                          >
                            <PencilLine className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeAffirmation(affirmation.id)}
                          >
                            <Trash className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Created: {formatDate(new Date(affirmation.createdAt))}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-slate-700">
                  <h3 className="text-lg font-medium mb-4">New Affirmation</h3>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Enter a positive affirmation"
                      value={newAffirmation}
                      onChange={e => setNewAffirmation(e.target.value)}
                    />
                    
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Category</label>
                      <Select value={affirmationCategory} onValueChange={setAffirmationCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confidence">Confidence</SelectItem>
                          <SelectItem value="resilience">Resilience</SelectItem>
                          <SelectItem value="gratitude">Gratitude</SelectItem>
                          <SelectItem value="abundance">Abundance</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={addAffirmation}>Add Affirmation</Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="vision-board" className="m-0">
              <CardHeader>
                <CardTitle>Vision Board</CardTitle>
                <CardDescription>Visualize your goals and aspirations</CardDescription>
              </CardHeader>
              <CardContent>
                {visionItems.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <Image className="h-24 w-24 text-slate-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your Vision Board is Empty</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Add images and notes that represent your goals, dreams, and aspirations.
                    </p>
                    <Button 
                      onClick={() => setVisionDialogOpen(true)}
                      className="bg-[#FF6500] hover:bg-[#FF6500]/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Vision Item
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {visionItems.map(item => (
                      <div 
                        key={item.id} 
                        className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800 flex flex-col"
                      >
                        {item.imageUrl && (
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{item.title}</h3>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeVisionItem(item.id)}
                            >
                              <Trash className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                          {item.note && <p className="text-sm text-muted-foreground">{item.note}</p>}
                          <div className="mt-auto pt-2 text-xs text-muted-foreground">
                            <time>{formatDate(new Date(item.createdAt))}</time>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      onClick={() => setVisionDialogOpen(true)}
                      className="h-full min-h-[200px] border-2 border-dashed border-slate-700 bg-transparent hover:bg-slate-800/50 flex flex-col items-center justify-center gap-2"
                    >
                      <Plus className="h-8 w-8" />
                      <span>Add Vision Item</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
      
      {/* Vision Board Dialog */}
      <Dialog open={visionDialogOpen} onOpenChange={setVisionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Vision Board Item</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                placeholder="What does this vision represent?"
                value={newVisionTitle}
                onChange={(e) => setNewVisionTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Note (Optional)</label>
              <Textarea 
                placeholder="Add details about this vision"
                value={newVisionNote}
                onChange={(e) => setNewVisionNote(e.target.value)}
                className="h-20"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Image (Optional)</label>
              {newVisionImagePreview ? (
                <div className="relative h-48 rounded-md overflow-hidden">
                  <img 
                    src={newVisionImagePreview} 
                    alt="Vision preview" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                    onClick={() => {
                      setNewVisionImage(null);
                      setNewVisionImagePreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center border-2 border-dashed border-slate-700 rounded-md h-32">
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                    <Upload className="h-8 w-8 text-slate-500 mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload an image</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={resetVisionForm} className="sm:w-full">Cancel</Button>
            <Button 
              onClick={addVisionItem} 
              className="sm:w-full bg-[#FF6500] hover:bg-[#FF6500]/90"
              disabled={!newVisionTitle.trim()}
            >
              Add to Vision Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {editingItem?.startsWith('core-') && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Core Value</label>
                  <Input 
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="h-20"
                  />
                </div>
              </>
            )}
            
            {editingItem?.startsWith('ms-') && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Mission Statement</label>
                <Textarea 
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-24"
                />
              </div>
            )}
            
            {editingItem?.startsWith('b-') && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Belief</label>
                  <Input 
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={editCategory} onValueChange={setEditCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="relationships">Relationships</SelectItem>
                      <SelectItem value="abundance">Abundance</SelectItem>
                      <SelectItem value="purpose">Purpose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {editingItem?.startsWith('a-') && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Affirmation</label>
                  <Input 
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={editCategory} onValueChange={setEditCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confidence">Confidence</SelectItem>
                      <SelectItem value="resilience">Resilience</SelectItem>
                      <SelectItem value="gratitude">Gratitude</SelectItem>
                      <SelectItem value="abundance">Abundance</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Mindset;
