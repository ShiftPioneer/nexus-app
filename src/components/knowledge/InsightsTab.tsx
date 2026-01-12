import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Skillset } from "@/types/knowledge";
import { 
  Brain, BookOpen, LayoutGrid, TrendingUp, Award, Target, 
  Clock, Zap, Flame, Trophy, Star, Calendar, ArrowUpRight,
  Lightbulb, Sparkles, BarChart3, PieChart, Activity
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, Cell, PieChart as RechartsPieChart, Pie
} from "recharts";
import { differenceInDays, format, subDays, startOfWeek, eachDayOfInterval } from "date-fns";

interface Resource {
  id: string;
  name: string;
  type: string;
  status?: string;
  isFavorite?: boolean;
}

interface Book {
  id: string;
  title: string;
  readingStatus: string;
  rating: number;
}

export function InsightsTab() {
  const [skillsets] = useLocalStorage<Skillset[]>("userSkillsets", []);
  const [resources] = useLocalStorage<Resource[]>("userResources", []);
  const [books] = useLocalStorage<Book[]>("userBooks", []);
  const [readingGoal] = useLocalStorage<number>("readingGoal", 12);

  // Calculate comprehensive stats
  const stats = useMemo(() => {
    const skillsCount = skillsets.length;
    const resourcesCount = resources.length;
    const booksCount = books.length;
    
    const avgMastery = skillsCount > 0 
      ? Math.round(skillsets.reduce((acc, s) => acc + s.mastery, 0) / skillsCount) 
      : 0;
    
    const expertSkills = skillsets.filter(s => s.mastery >= 80).length;
    const intermediateSkills = skillsets.filter(s => s.mastery >= 40 && s.mastery < 80).length;
    const beginnerSkills = skillsets.filter(s => s.mastery < 40).length;
    
    const completedResources = resources.filter(r => r.status === 'completed').length;
    const inProgressResources = resources.filter(r => r.status === 'in_progress').length;
    
    const finishedBooks = books.filter(b => b.readingStatus === "Finished").length;
    const readingBooks = books.filter(b => b.readingStatus === "Reading Now").length;
    const avgBookRating = books.filter(b => b.rating > 0).length > 0
      ? books.filter(b => b.rating > 0).reduce((acc, b) => acc + b.rating, 0) / books.filter(b => b.rating > 0).length
      : 0;
    
    const totalItems = skillsCount + resourcesCount + booksCount;
    
    // Calculate knowledge score (0-100)
    const knowledgeScore = Math.min(100, Math.round(
      (avgMastery * 0.4) + 
      (completedResources * 5) + 
      (finishedBooks * 10) +
      (expertSkills * 15)
    ));

    // Skills needing practice
    const skillsNeedingPractice = skillsets.filter(s => {
      const days = differenceInDays(new Date(), new Date(s.lastPracticed));
      return days > 7;
    });

    return {
      skillsCount,
      resourcesCount,
      booksCount,
      avgMastery,
      expertSkills,
      intermediateSkills,
      beginnerSkills,
      completedResources,
      inProgressResources,
      finishedBooks,
      readingBooks,
      avgBookRating,
      totalItems,
      knowledgeScore,
      skillsNeedingPractice,
      readingGoalProgress: Math.round((finishedBooks / readingGoal) * 100)
    };
  }, [skillsets, resources, books, readingGoal]);

  // Prepare chart data
  const skillMasteryData = useMemo(() => 
    skillsets.map(s => ({
      subject: s.name.length > 10 ? s.name.substring(0, 10) + '...' : s.name,
      mastery: s.mastery,
      fullMark: 100
    })), [skillsets]
  );

  const categoryDistribution = useMemo(() => {
    const categories: Record<string, number> = {};
    skillsets.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [skillsets]);

  const resourceTypeDistribution = useMemo(() => {
    const types: Record<string, number> = {};
    resources.forEach(r => {
      types[r.type] = (types[r.type] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [resources]);

  const COLORS = ['#FF6500', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444'];

  // Learning activity mock data (would be real data in production)
  const activityData = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 30),
      end: new Date()
    });
    return days.map(day => ({
      date: format(day, 'MMM d'),
      activity: Math.floor(Math.random() * 5) + 1
    }));
  }, []);

  return (
    <div className="space-y-8">
      {/* Knowledge Score Header */}
      <Card className="bg-gradient-to-r from-primary/20 via-orange-500/20 to-red-500/20 border border-primary/30 shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center shadow-2xl">
                  <div className="w-28 h-28 rounded-full bg-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{stats.knowledgeScore}</p>
                      <p className="text-xs text-slate-400">Knowledge Score</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-2">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Your Learning Journey
                </h2>
                <p className="text-slate-400 mt-2">
                  Track your progress and discover insights about your growth
                </p>
                <div className="flex gap-2 mt-4">
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Zap className="h-3 w-3 mr-1" /> Active Learner
                  </Badge>
                  {stats.expertSkills >= 3 && (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                      <Award className="h-3 w-3 mr-1" /> Expert Level
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <Brain className="h-6 w-6 text-violet-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stats.skillsCount}</p>
                <p className="text-xs text-slate-400">Skills</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <LayoutGrid className="h-6 w-6 text-cyan-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stats.resourcesCount}</p>
                <p className="text-xs text-slate-400">Resources</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <BookOpen className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stats.booksCount}</p>
                <p className="text-xs text-slate-400">Books</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <p className="text-2xl font-bold text-white">{stats.expertSkills}</p>
              <p className="text-xs text-slate-400">Expert Skills</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Target className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.completedResources}</p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Star className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.avgBookRating.toFixed(1)}</p>
              <p className="text-xs text-slate-400">Avg Book Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Radar */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="h-5 w-5 text-violet-500" />
              Skills Mastery Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {skillMasteryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillMasteryData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                  <Radar
                    name="Mastery"
                    dataKey="mastery"
                    stroke="#FF6500"
                    fill="#FF6500"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Add skills to see your mastery radar</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PieChart className="h-5 w-5 text-cyan-500" />
              Skills by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Add skills to see category distribution</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resource Types & Learning Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Types */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              Resources by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resourceTypeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={resourceTypeDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" tick={{ fill: '#9ca3af' }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 12 }} width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]}>
                    {resourceTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <LayoutGrid className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Add resources to see type distribution</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Activity */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5 text-primary" />
              Learning Activity (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6500" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF6500" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} interval={6} />
                <YAxis tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="activity" 
                  stroke="#FF6500" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorActivity)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Reading Goal & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading Goal Progress */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              Reading Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Books completed this year</span>
              <span className="text-2xl font-bold text-white">{stats.finishedBooks} / {readingGoal}</span>
            </div>
            <Progress value={stats.readingGoalProgress} className="h-4" />
            <div className="flex justify-between text-sm text-slate-400">
              <span>{stats.readingGoalProgress}% complete</span>
              <span>{readingGoal - stats.finishedBooks} books to go</span>
            </div>
            <div className="pt-4 border-t border-slate-700/30">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-slate-300">Currently reading: {stats.readingBooks} book(s)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Needing Practice */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Flame className="h-5 w-5 text-red-500" />
              Skills Needing Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.skillsNeedingPractice.length > 0 ? (
              <div className="space-y-3">
                {stats.skillsNeedingPractice.slice(0, 5).map(skill => (
                  <div 
                    key={skill.id} 
                    className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: skill.color || '#FF6500' }} 
                      />
                      <span className="text-white font-medium">{skill.name}</span>
                    </div>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                      {differenceInDays(new Date(), new Date(skill.lastPracticed))}d ago
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Award className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
                  <p className="text-emerald-400">All skills recently practiced!</p>
                  <p className="text-sm">Keep up the great work</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Learning Tips */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Learning Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-medium text-white">Focus on Weak Areas</span>
              </div>
              <p className="text-sm text-slate-400">
                Prioritize skills below 40% mastery for faster improvement.
              </p>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <span className="font-medium text-white">Practice Daily</span>
              </div>
              <p className="text-sm text-slate-400">
                Consistent practice beats sporadic intense sessions.
              </p>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-violet-500" />
                <span className="font-medium text-white">Mix Learning Methods</span>
              </div>
              <p className="text-sm text-slate-400">
                Combine books, courses, and practice for best retention.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
