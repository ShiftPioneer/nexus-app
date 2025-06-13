
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, CheckCircle } from "lucide-react";
import { useGTD } from "./GTDContext";

const GTDReview = () => {
  const { tasks } = useGTD();
  
  const stats = {
    inbox: tasks.filter(task => task.status === "inbox").length,
    projects: tasks.filter(task => task.status === "project").length,
    nextActions: tasks.filter(task => task.status === "next-action").length,
    waiting: tasks.filter(task => task.status === "waiting-for").length,
    completed: tasks.filter(task => task.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Weekly Review
        </h2>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Start Review
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Inbox Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inbox}</div>
            <p className="text-xs text-muted-foreground">Items to process</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projects}</div>
            <p className="text-xs text-muted-foreground">Ongoing projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Next Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nextActions}</div>
            <p className="text-xs text-muted-foreground">Ready to execute</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Review Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <span>Process all inbox items</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <span>Review project statuses</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <span>Update next actions</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <span>Follow up on waiting items</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GTDReview;
