
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface KnowledgeInboxProps {
  onAddEntry?: () => void;
}

export function KnowledgeInbox({ onAddEntry }: KnowledgeInboxProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Knowledge Inbox</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Quickly capture ideas, thoughts, and resources to process later.
        </p>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2" 
            size="sm"
            onClick={onAddEntry}
          >
            <Plus className="h-4 w-4" />
            Add Quick Note
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2" 
            size="sm"
            onClick={onAddEntry}
          >
            <Plus className="h-4 w-4" />
            Add Resource Link
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2" 
            size="sm"
            onClick={onAddEntry}
          >
            <Plus className="h-4 w-4" />
            Add Quick Thought
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
