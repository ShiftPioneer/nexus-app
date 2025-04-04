
import React from "react";
import { useKnowledge } from "@/contexts/KnowledgeContext";
import { KnowledgeCategory } from "@/types/knowledge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, FolderOpen, Inbox, Archive, FileText } from "lucide-react";
import KnowledgeList from "./KnowledgeList";

interface KnowledgeCategoryViewProps {
  category: KnowledgeCategory | "all";
  showEntryList?: boolean;
}

const KnowledgeCategoryView: React.FC<KnowledgeCategoryViewProps> = ({ 
  category, 
  showEntryList = true 
}) => {
  const { getEntriesByCategory } = useKnowledge();
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "inbox": return <Inbox className="h-5 w-5" />;
      case "projects": return <FileSpreadsheet className="h-5 w-5" />;
      case "areas": return <FolderOpen className="h-5 w-5" />;
      case "resources": return <FileText className="h-5 w-5" />;
      case "archives": return <Archive className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };
  
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "all": return "All Knowledge";
      case "inbox": return "Inbox - Capture & Process";
      case "projects": return "Projects - Active Work";
      case "areas": return "Areas - Responsibilities";
      case "resources": return "Resources - References";
      case "archives": return "Archives - Completed";
      default: return category;
    }
  };
  
  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "all":
        return "All your knowledge entries across all categories";
      case "inbox":
        return "Newly captured knowledge waiting to be processed and organized";
      case "projects":
        return "Knowledge supporting your current active projects with defined outcomes";
      case "areas":
        return "Knowledge supporting your ongoing responsibilities without end dates";
      case "resources":
        return "Reference materials and information you want to save for later";
      case "archives":
        return "Completed or inactive knowledge you want to keep for reference";
      default:
        return "";
    }
  };
  
  const entries = category !== "all" ? getEntriesByCategory(category as KnowledgeCategory) : [];
  
  return (
    <div className="space-y-4">
      <CardHeader className="flex flex-row items-center gap-2">
        {getCategoryIcon(category)}
        <CardTitle>{getCategoryTitle(category)}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground mb-4">
          {getCategoryDescription(category)}
        </p>
        
        {category === "inbox" && (
          <div className="p-4 bg-muted/50 rounded-lg mb-4">
            <h3 className="font-semibold mb-1">Inbox Guidelines</h3>
            <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
              <li>Capture everything that comes to mind without filtering</li>
              <li>Process inbox items regularly (ideally daily)</li>
              <li>Move items to appropriate categories based on their purpose</li>
              <li>Delete items that don't provide lasting value</li>
            </ul>
          </div>
        )}
        
        {category === "projects" && (
          <div className="p-4 bg-muted/50 rounded-lg mb-4">
            <h3 className="font-semibold mb-1">Projects Guidelines</h3>
            <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
              <li>Knowledge that supports active, time-bound projects</li>
              <li>Link entries to related tasks in the GTD system</li>
              <li>Move to archives when the project completes</li>
              <li>Review during Weekly Review to keep projects moving</li>
            </ul>
          </div>
        )}
        
        {category === "areas" && (
          <div className="p-4 bg-muted/50 rounded-lg mb-4">
            <h3 className="font-semibold mb-1">Areas Guidelines</h3>
            <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
              <li>Knowledge related to your ongoing responsibilities</li>
              <li>Things you want to maintain at a standard over time</li>
              <li>Examples: Health, Finances, Relationships, Career</li>
              <li>Review during Monthly Review to maintain areas</li>
            </ul>
          </div>
        )}
        
        {category === "resources" && (
          <div className="p-4 bg-muted/50 rounded-lg mb-4">
            <h3 className="font-semibold mb-1">Resources Guidelines</h3>
            <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
              <li>Reference materials you may need in the future</li>
              <li>Use thorough tagging to make resources easy to find</li>
              <li>Consider adding AI-generated summaries for long content</li>
              <li>Review occasionally to archive or delete outdated resources</li>
            </ul>
          </div>
        )}
        
        {category === "archives" && (
          <div className="p-4 bg-muted/50 rounded-lg mb-4">
            <h3 className="font-semibold mb-1">Archives Guidelines</h3>
            <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
              <li>Move completed projects and outdated references here</li>
              <li>Keep well-tagged for future reference if needed</li>
              <li>Consider quarterly cleanup to delete truly obsolete items</li>
              <li>Use search to find archived items when needed</li>
            </ul>
          </div>
        )}
        
        {category === "all" && (
          <div className="p-4 bg-muted/50 rounded-lg mb-4">
            <h3 className="font-semibold mb-1">Second Brain System</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Your Second Brain uses the PARA framework to organize knowledge:
            </p>
            <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
              <li><span className="font-medium">P</span>rojects: Time-bound work with defined outcomes</li>
              <li><span className="font-medium">A</span>reas: Ongoing responsibilities to maintain</li>
              <li><span className="font-medium">R</span>esources: Reference materials for future use</li>
              <li><span className="font-medium">A</span>rchives: Completed or inactive items</li>
            </ul>
          </div>
        )}
        
        {showEntryList && category !== "all" && (
          <KnowledgeList entries={entries} showCategory={false} />
        )}
      </CardContent>
    </div>
  );
};

export default KnowledgeCategoryView;
