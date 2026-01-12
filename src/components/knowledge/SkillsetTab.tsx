
import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Star, TrendingUp, Search, Filter, Target, Clock, Zap, Award, BookOpen, Calendar, ArrowUpRight, Sparkles } from "lucide-react";
import { Skillset, SkillsetCategory } from "@/types/knowledge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { SkillsetDialog } from "./SkillsetDialog";
import { MasteryChart } from "./MasteryChart";
import { CategoryChart } from "./CategoryChart";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";

const defaultSkillsets: Skillset[] = [
  {
    id: "1",
    name: "JavaScript",
    description: "Modern JavaScript programming language",
    category: "Programming",
    mastery: 75,
    lastPracticed: new Date("2023-12-15"),
    resourceCount: 5,
    color: "#f59e0b"
  },
  {
    id: "2",
    name: "UI/UX Design",
    description: "User interface and experience design",
    category: "Design",
    mastery: 60,
    lastPracticed: new Date("2023-12-10"),
    resourceCount: 8,
    color: "#ec4899"
  },
  {
    id: "3",
    name: "Data Science",
    description: "Statistical analysis and machine learning",
    category: "Analytics",
    mastery: 40,
    lastPracticed: new Date("2023-11-28"),
    resourceCount: 12,
    color: "#10b981"
  },
  {
    id: "4",
    name: "Public Speaking",
    description: "Effective communication and presentation skills",
    category: "Soft Skills",
    mastery: 80,
    lastPracticed: new Date("2023-12-05"),
    resourceCount: 3,
    color: "#8b5cf6"
  }
];

const skillsetCategories: SkillsetCategory[] = [
  'Programming', 'Design', 'Analytics', 'Soft Skills', 'Language', 
  'Music', 'Sport', 'Art', 'Business', 'Religion', 'Other'
];

export function SkillsetTab() {
  const [skillsetsRaw, setSkillsetsRaw] = useLocalStorage<Skillset[]>("userSkillsets", defaultSkillsets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentSkillset, setCurrentSkillset] = useState<Skillset | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "mastery" | "lastPracticed">("mastery");

  // Convert lastPracticed strings back to Date objects when loading from localStorage
  const skillsets = useMemo(() => 
    skillsetsRaw.map(skillset => ({
      ...skillset,
      lastPracticed: typeof skillset.lastPracticed === 'string' ? new Date(skillset.lastPracticed) : skillset.lastPracticed
    })), [skillsetsRaw]
  );

  // Filter and sort skillsets
  const filteredSkillsets = useMemo(() => {
    let filtered = skillsets.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "mastery":
          return b.mastery - a.mastery;
        case "lastPracticed":
          return new Date(b.lastPracticed).getTime() - new Date(a.lastPracticed).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [skillsets, searchTerm, categoryFilter, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = skillsets.length;
    const avgMastery = total > 0 ? Math.round(skillsets.reduce((acc, s) => acc + s.mastery, 0) / total) : 0;
    const expertCount = skillsets.filter(s => s.mastery >= 80).length;
    const needsPractice = skillsets.filter(s => {
      const days = differenceInDays(new Date(), new Date(s.lastPracticed));
      return days > 7;
    }).length;
    const totalResources = skillsets.reduce((acc, s) => acc + s.resourceCount, 0);
    
    return { total, avgMastery, expertCount, needsPractice, totalResources };
  }, [skillsets]);

  const handleAddSkillset = (skillset: Skillset) => {
    if (currentSkillset) {
      setSkillsetsRaw(skillsetsRaw.map(s => s.id === skillset.id ? skillset : s));
      toast.success("Skillset updated successfully!");
    } else {
      setSkillsetsRaw([...skillsetsRaw, {
        ...skillset,
        id: Date.now().toString()
      }]);
      toast.success("New skillset added!");
    }
    setDialogOpen(false);
    setCurrentSkillset(null);
  };

  const handleEdit = (skillset: Skillset) => {
    setCurrentSkillset(skillset);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSkillsetsRaw(skillsetsRaw.filter(s => s.id !== id));
    toast.success("Skillset deleted");
  };

  const handlePractice = (skillset: Skillset) => {
    const updated = {
      ...skillset,
      lastPracticed: new Date(),
      mastery: Math.min(100, skillset.mastery + 2)
    };
    setSkillsetsRaw(skillsetsRaw.map(s => s.id === skillset.id ? updated : s));
    toast.success(`Great job practicing ${skillset.name}! +2% mastery`);
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return "from-emerald-500 to-teal-500";
    if (mastery >= 60) return "from-amber-500 to-orange-500";
    if (mastery >= 40) return "from-violet-500 to-purple-500";
    return "from-slate-500 to-gray-500";
  };

  const getMasteryLabel = (mastery: number) => {
    if (mastery >= 80) return "Expert";
    if (mastery >= 60) return "Advanced";
    if (mastery >= 40) return "Intermediate";
    return "Beginner";
  };

  const getDaysSincePractice = (date: Date) => {
    return differenceInDays(new Date(), new Date(date));
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-slate-400">Total Skills</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.avgMastery}%</p>
              <p className="text-xs text-slate-400">Avg Mastery</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Award className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.expertCount}</p>
              <p className="text-xs text-slate-400">Expert Level</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Clock className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.needsPractice}</p>
              <p className="text-xs text-slate-400">Need Practice</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <BookOpen className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalResources}</p>
              <p className="text-xs text-slate-400">Resources</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Your Skillsets</h2>
          <p className="text-slate-400 mt-2">Track and develop your professional skills</p>
        </div>
        <Button 
          onClick={() => {
            setCurrentSkillset(null);
            setDialogOpen(true);
          }} 
          className="gap-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg border-none rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
        >
          <Plus size={18} />
          Add Skillset
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-400"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px] bg-slate-900/50 border-slate-700/50 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">All Categories</SelectItem>
            {skillsetCategories.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-white hover:bg-slate-700">{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <SelectTrigger className="w-[160px] bg-slate-900/50 border-slate-700/50 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="mastery" className="text-white hover:bg-slate-700">Highest Mastery</SelectItem>
            <SelectItem value="name" className="text-white hover:bg-slate-700">Name A-Z</SelectItem>
            <SelectItem value="lastPracticed" className="text-white hover:bg-slate-700">Recently Practiced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Skills Grid */}
      {filteredSkillsets.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No skills found"
          description={searchTerm || categoryFilter !== "all" 
            ? "Try adjusting your search or filters" 
            : "Start building your skill portfolio by adding your first skill"}
          action={
            <Button 
              onClick={() => {
                setCurrentSkillset(null);
                setDialogOpen(true);
              }}
              className="mt-4 bg-gradient-to-r from-purple-500 to-violet-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkillsets.map(skillset => {
            const daysSince = getDaysSincePractice(skillset.lastPracticed);
            const needsPractice = daysSince > 7;
            
            return (
              <Card key={skillset.id} className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl backdrop-blur-sm group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl" />
                </div>
                
                {/* Practice reminder badge */}
                {needsPractice && (
                  <div className="absolute top-3 right-3 z-20">
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs animate-pulse">
                      <Clock className="h-3 w-3 mr-1" />
                      {daysSince}d ago
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-6 relative z-10">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: skillset.color || '#f59e0b' }} 
                        />
                        <h3 className="text-xl font-bold text-white">{skillset.name}</h3>
                      </div>
                      <p className="text-slate-400 text-sm line-clamp-2">{skillset.description}</p>
                      <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600/50 text-xs">
                        {skillset.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300 font-semibold flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Mastery Level
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getMasteryColor(skillset.mastery)} text-white`}>
                            {getMasteryLabel(skillset.mastery)}
                          </span>
                          <span className="text-sm font-bold text-white">{skillset.mastery}%</span>
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={skillset.mastery} className="h-3 bg-slate-800/50" />
                        <div 
                          className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${getMasteryColor(skillset.mastery)} transition-all duration-500`}
                          style={{ width: `${skillset.mastery}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-slate-400 pt-2 border-t border-slate-700/30">
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {skillset.resourceCount} resources
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(skillset.lastPracticed), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm"
                        onClick={() => handlePractice(skillset)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs"
                      >
                        <Target className="h-3 w-3 mr-1" />
                        Log Practice
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleEdit(skillset)} 
                        className="border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 text-slate-300 hover:text-white transition-all duration-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleDelete(skillset.id)} 
                        className="border-red-600/50 hover:bg-red-600/20 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="font-bold text-2xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Mastery Overview</h3>
            <MasteryChart skillsets={skillsets} />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="font-bold text-2xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Categories</h3>
            <CategoryChart skillsets={skillsets} />
          </CardContent>
        </Card>
      </div>
      
      <SkillsetDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSave={handleAddSkillset} 
        skillset={currentSkillset} 
      />
    </div>
  );
}
