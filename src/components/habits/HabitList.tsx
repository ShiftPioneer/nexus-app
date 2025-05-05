
import React from 'react';
import { CheckCircle, Circle, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface HabitListProps {
  habits: Array<{
    id: string;
    title: string;
    category: string;
    streak: number;
    target: number;
    status: "completed" | "pending" | "missed";
    type: "daily" | "weekly" | "monthly";
    completedToday: boolean;
    accountabilityScore: number;
  }>;
  toggleHabitCompletion: (id: string) => void;
  deleteHabit: (id: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ 
  habits, 
  toggleHabitCompletion, 
  deleteHabit
}) => {
  // Helper function to get badge color based on habit category
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'health':
        return 'bg-green-500 hover:bg-green-600';
      case 'mindfulness':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'learning':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'productivity':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'finance':
        return 'bg-emerald-500 hover:bg-emerald-600';
      case 'relationships':
        return 'bg-pink-500 hover:bg-pink-600';
      case 'religion':
        return 'bg-indigo-500 hover:bg-indigo-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <Card key={habit.id} className="overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => toggleHabitCompletion(habit.id)}
                    >
                      {habit.completedToday ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-300" />
                      )}
                    </Button>
                    <h3 className="text-lg font-medium">{habit.title}</h3>
                  </div>
                  <div className="ml-10 mt-1 flex flex-wrap gap-2">
                    <Badge className={`${getCategoryColor(habit.category)} text-white`}>
                      {habit.category}
                    </Badge>
                    <Badge variant="outline" className="bg-background">
                      {habit.type}
                    </Badge>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      {habit.streak} day streak
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteHabit(habit.id)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="ml-10 mt-3">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Progress</span>
                  <span>
                    Accountability Score: {habit.accountabilityScore}
                  </span>
                </div>
                <Progress 
                  value={(habit.streak / habit.target) * 100} 
                  className="h-2" 
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HabitList;
