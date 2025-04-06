
import React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KnowledgeCategory } from "@/types/knowledge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useKnowledge } from "@/contexts/KnowledgeContext";

interface KnowledgeCategoryViewProps {
  category: KnowledgeCategory;
  showEntryList?: boolean;
}

function KnowledgeCategoryView({ category, showEntryList = true }: KnowledgeCategoryViewProps) {
  const { entries, getEntriesByCategory } = useKnowledge();
  
  const categoryData = [
    { name: 'Inbox', value: entries.filter(e => e.category === 'inbox').length, color: '#f97316' },
    { name: 'Projects', value: entries.filter(e => e.category === 'projects').length, color: '#3b82f6' },
    { name: 'Areas', value: entries.filter(e => e.category === 'areas').length, color: '#10b981' },
    { name: 'Resources', value: entries.filter(e => e.category === 'resources').length, color: '#8b5cf6' },
    { name: 'Archives', value: entries.filter(e => e.category === 'archives').length, color: '#6b7280' },
    { name: 'Other', value: entries.filter(e => !['inbox', 'projects', 'areas', 'resources', 'archives'].includes(e.category)).length, color: '#d1d5db' },
  ];
  
  // Filter out categories with 0 entries
  const filteredCategoryData = categoryData.filter(cat => cat.value > 0);
  
  const getCategoryTitle = () => {
    if (category === 'all') return 'All Categories';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  const getCategoryDescription = () => {
    switch (category) {
      case 'inbox': return 'Temporary storage for new ideas and information';
      case 'projects': return 'Active projects you\'re working on';
      case 'areas': return 'Ongoing areas of responsibility';
      case 'resources': return 'References and materials you want to keep';
      case 'archives': return 'Completed or inactive items';
      default: return 'All your knowledge entries';
    }
  };
  
  return (
    <>
      <CardHeader>
        <CardTitle>{getCategoryTitle()}</CardTitle>
        <p className="text-sm text-muted-foreground">{getCategoryDescription()}</p>
      </CardHeader>
      
      <CardContent>
        {filteredCategoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={filteredCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {filteredCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No entries to display</p>
          </div>
        )}
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total Entries</span>
            <span className="font-medium">{entries.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>In Selected Category</span>
            <span className="font-medium">
              {category === 'all' ? entries.length : entries.filter(e => e.category === category).length}
            </span>
          </div>
        </div>
      </CardContent>
    </>
  );
}

export default KnowledgeCategoryView;
