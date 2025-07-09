
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Image, Target, Star, Heart, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";

interface VisionItem {
  id: string;
  title: string;
  description: string;
  category: "career" | "health" | "relationships" | "personal" | "financial";
  isAchieved: boolean;
}

const VisionBoardSection = () => {
  const [visionItems, setVisionItems] = useState<VisionItem[]>([
    {
      id: "1",
      title: "Launch My Dream Business",
      description: "Create a sustainable business that aligns with my values and makes a positive impact.",
      category: "career",
      isAchieved: false
    },
    {
      id: "2", 
      title: "Run a Marathon",
      description: "Complete a full marathon while maintaining excellent health and fitness.",
      category: "health",
      isAchieved: false
    }
  ]);

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "personal" as const
  });

  const [showForm, setShowForm] = useState(false);

  const categories = [
    { key: "career", label: "Career", icon: Target, color: "text-blue-400", bg: "bg-blue-500/20" },
    { key: "health", label: "Health", icon: Heart, color: "text-red-400", bg: "bg-red-500/20" },
    { key: "relationships", label: "Relationships", icon: Star, color: "text-pink-400", bg: "bg-pink-500/20" },
    { key: "personal", label: "Personal", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/20" },
    { key: "financial", label: "Financial", icon: Target, color: "text-green-400", bg: "bg-green-500/20" }
  ];

  const handleAddVision = () => {
    if (!newItem.title.trim()) return;

    const vision: VisionItem = {
      id: Date.now().toString(),
      title: newItem.title.trim(),
      description: newItem.description.trim(),
      category: newItem.category,
      isAchieved: false
    };

    setVisionItems([...visionItems, vision]);
    setNewItem({ title: "", description: "", category: "personal" });
    setShowForm(false);
  };

  const toggleAchieved = (id: string) => {
    setVisionItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isAchieved: !item.isAchieved } : item
      )
    );
  };

  const removeVision = (id: string) => {
    setVisionItems(items => items.filter(item => item.id !== id));
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.key === category) || categories[0];
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Vision Board</h2>
            <p className="text-slate-400">Visualize your dreams and aspirations</p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vision
        </Button>
      </motion.div>

      {/* Add Vision Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Create New Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Vision Title</label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="What do you want to achieve?"
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Describe your vision in detail..."
                  rows={3}
                  className="bg-slate-800/50 border-slate-600 text-white resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Category</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.key}
                      type="button"
                      onClick={() => setNewItem({ ...newItem, category: category.key as any })}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        newItem.category === category.key
                          ? `${category.bg} border-primary/50`
                          : "bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/30"
                      }`}
                    >
                      <category.icon className={`h-4 w-4 mx-auto mb-1 ${
                        newItem.category === category.key ? category.color : "text-slate-400"
                      }`} />
                      <div className={`text-xs ${
                        newItem.category === category.key ? "text-white" : "text-slate-400"
                      }`}>
                        {category.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddVision} className="bg-primary hover:bg-primary/90">
                  Create Vision
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="border-slate-600 text-slate-300">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visionItems.map((item, index) => {
          const categoryInfo = getCategoryInfo(item.category);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                item.isAchieved 
                  ? "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30" 
                  : "bg-slate-900/50 border-slate-700 hover:border-slate-600"
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${categoryInfo.bg} flex items-center justify-center`}>
                        <categoryInfo.icon className={`h-5 w-5 ${categoryInfo.color}`} />
                      </div>
                      <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                        {categoryInfo.label}
                      </Badge>
                    </div>
                    <button
                      onClick={() => removeVision(item.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <h3 className={`font-semibold mb-2 ${item.isAchieved ? "text-green-300" : "text-white"}`}>
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  
                  <Button
                    onClick={() => toggleAchieved(item.id)}
                    variant={item.isAchieved ? "default" : "outline"}
                    size="sm"
                    className={item.isAchieved 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }
                  >
                    {item.isAchieved ? "✓ Achieved" : "Mark as Achieved"}
                  </Button>
                </CardContent>

                {item.isAchieved && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {visionItems.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No visions yet</h3>
          <p className="text-slate-500 mb-4">Start building your vision board by adding your first dream or goal.</p>
          <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Vision
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default VisionBoardSection;
