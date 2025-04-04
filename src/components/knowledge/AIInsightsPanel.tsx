
import React from "react";
import { useKnowledge } from "@/contexts/KnowledgeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Brain, CheckSquare, Lightbulb, RefreshCcw, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const AIInsightsPanel: React.FC = () => {
  const { entries, getEntriesStats } = useKnowledge();
  const stats = getEntriesStats();
  
  // Generate insights based on the user's knowledge entries
  const getInsights = () => {
    // Very simple insights based on the data pattern
    // In a real app, this would leverage actual AI
    const insights = [];
    
    // Check inbox
    if (stats.categories.inboxCount > 5) {
      insights.push({
        type: "warning",
        icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        title: "Inbox needs processing",
        description: `You have ${stats.categories.inboxCount} items in your inbox. Consider processing them to keep your system organized.`
      });
    }
    
    // Check for entries without tags
    const entriesWithoutTags = entries.filter(entry => entry.tags.length === 0).length;
    if (entriesWithoutTags > 0) {
      insights.push({
        type: "tip",
        icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
        title: "Add tags to improve findability",
        description: `${entriesWithoutTags} entries don't have tags. Adding tags helps you find them later.`
      });
    }
    
    // Check for task linkage opportunities
    const unlinkedEntries = entries.filter(entry => !entry.linkedTaskIds || entry.linkedTaskIds.length === 0).length;
    const percentUnlinked = Math.round((unlinkedEntries / entries.length) * 100);
    if (percentUnlinked > 70) {
      insights.push({
        type: "opportunity",
        icon: <CheckSquare className="h-5 w-5 text-blue-500" />,
        title: "Link knowledge to tasks",
        description: "Consider connecting more of your knowledge entries to tasks to improve your workflow."
      });
    }
    
    // Check category distribution
    if (stats.categories.resourcesCount > stats.totalEntries * 0.7) {
      insights.push({
        type: "pattern",
        icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
        title: "Heavy on resources",
        description: "Most of your entries are resources. Consider reviewing them to identify potential projects or areas."
      });
    }
    
    // Add general tips
    insights.push({
      type: "ai",
      icon: <Brain className="h-5 w-5 text-emerald-500" />,
      title: "Weekly knowledge review",
      description: "Set aside 15 minutes weekly to review and organize your knowledge system for better retention and use."
    });
    
    return insights;
  };
  
  const insights = getInsights();
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {insight.icon}
                <h3 className="font-medium">{insight.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {insight.description}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-10 w-10 mx-auto mb-4 opacity-50" />
            <p>No insights available at the moment.</p>
            <p className="text-sm mt-1">Try adding more knowledge entries.</p>
          </div>
        )}
        
        <div className="pt-4 mt-2 border-t">
          <h3 className="font-medium mb-2">Knowledge Stats</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Total Entries</p>
              <p className="text-xl font-medium">{stats.totalEntries}</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Linked to Tasks</p>
              <p className="text-xl font-medium">{stats.withTasks}</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">With Attachments</p>
              <p className="text-xl font-medium">{stats.withFiles}</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Categories</p>
              <p className="text-xl font-medium">5</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
