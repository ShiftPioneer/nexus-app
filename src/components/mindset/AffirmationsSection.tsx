import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, X, Play, Pause, RotateCcw, Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toastHelpers } from "@/utils/toast-helpers";

const AffirmationsSection = () => {
  const [affirmations, setAffirmations] = useState([
    "I am confident, capable, and worthy of success",
    "Every day I am becoming the best version of myself",
    "I attract abundance and positivity into my life",
    "I am grateful for all the opportunities that come my way",
    "I have the power to create the life I desire"
  ]);
  
  const [newAffirmation, setNewAffirmation] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dailyAffirmations, setDailyAffirmations] = useState<string[]>([]);

  // Auto-cycle through affirmations
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && affirmations.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % affirmations.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, affirmations.length]);

  // Generate daily affirmations
  useEffect(() => {
    const getRandomAffirmations = () => {
      const shuffled = [...affirmations].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    };
    setDailyAffirmations(getRandomAffirmations());
  }, [affirmations]);

  const addAffirmation = () => {
    if (newAffirmation.trim() && !affirmations.includes(newAffirmation.trim())) {
      setAffirmations([...affirmations, newAffirmation.trim()]);
      setNewAffirmation("");
      toastHelpers.success("Affirmation Added", {
        description: "New affirmation has been added to your collection!"
      });
    }
  };

  const removeAffirmation = (index: number) => {
    const newAffirmations = affirmations.filter((_, i) => i !== index);
    setAffirmations(newAffirmations);
    if (currentIndex >= newAffirmations.length) {
      setCurrentIndex(0);
    }
    toastHelpers.info("Affirmation Removed");
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    toastHelpers.info(isPlaying ? "Paused" : "Playing", {
      description: isPlaying ? "Affirmation cycle paused" : "Affirmation cycle started"
    });
  };

  const resetCycle = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const affirmationCategories = [
    { name: "Self-Love", icon: Heart, count: affirmations.filter(a => a.toLowerCase().includes('worthy') || a.toLowerCase().includes('love')).length },
    { name: "Success", icon: Star, count: affirmations.filter(a => a.toLowerCase().includes('success') || a.toLowerCase().includes('achieve')).length },
    { name: "Growth", icon: Sparkles, count: affirmations.filter(a => a.toLowerCase().includes('grow') || a.toLowerCase().includes('better')).length }
  ];

  return (
    <div className="space-y-6">
      {/* Daily Affirmations Spotlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white">Today's Affirmations</CardTitle>
                  <p className="text-purple-200">Your daily dose of positivity</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={togglePlayback}
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-500/20 text-purple-200 hover:text-white"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  onClick={resetCycle}
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-500/20 text-purple-200 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {affirmations.length > 0 && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20"
              >
                <p className="text-2xl font-semibold text-white mb-4 leading-relaxed">
                  {affirmations[currentIndex]}
                </p>
                
                <div className="flex items-center justify-center gap-2">
                  {affirmations.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex ? 'bg-purple-400 scale-125' : 'bg-purple-400/30'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Daily Highlights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailyAffirmations.slice(0, 3).map((affirmation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg text-center"
                >
                  <p className="text-sm text-slate-300 font-medium">{affirmation}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        {affirmationCategories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3">
                  <category.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{category.count}</div>
                <div className="text-sm text-slate-400">{category.name}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Affirmations Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-primary" />
              My Affirmations Collection
            </CardTitle>
            <p className="text-slate-400">Manage your personal affirmations library</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Add New Affirmation */}
            <div className="flex gap-3">
              <Input
                value={newAffirmation}
                onChange={(e) => setNewAffirmation(e.target.value)}
                placeholder="Add a new positive affirmation..."
                className="flex-1 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20"
                onKeyPress={(e) => e.key === 'Enter' && addAffirmation()}
              />
              <Button 
                onClick={addAffirmation}
                disabled={!newAffirmation.trim()}
                className="bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-lg"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Affirmations List */}
            <div className="grid gap-3">
              <AnimatePresence>
                {affirmations.map((affirmation, index) => (
                  <motion.div
                    key={affirmation}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                      index === currentIndex && isPlaying
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 shadow-lg'
                        : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/30'
                    }`}
                  >
                    <p className="text-slate-200 font-medium flex-1">{affirmation}</p>
                    
                    <div className="flex items-center gap-2">
                      {index === currentIndex && isPlaying && (
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          Playing
                        </Badge>
                      )}
                      
                      <Button
                        onClick={() => removeAffirmation(index)}
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Affirmation Tips */}
            <div className="p-4 bg-gradient-to-r from-green-950/20 to-emerald-950/20 border border-green-500/20 rounded-xl">
              <p className="text-sm text-green-200">
                <strong>Tip:</strong> Effective affirmations are positive, present-tense, personal, and specific. 
                Repeat them daily with conviction and emotion for maximum impact.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AffirmationsSection;
