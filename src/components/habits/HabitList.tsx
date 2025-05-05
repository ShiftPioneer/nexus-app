
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface HabitListProps {
  habits: Habit[];
  toggleHabitCompletion: (id: string) => void;
  deleteHabit: (id: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, toggleHabitCompletion, deleteHabit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {habits.map((habit) => (
        <Card key={habit.id} className={habit.completedToday ? 'border-green-500 border-2' : ''}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{habit.title}</CardTitle>
              <Badge variant={habit.category === 'health' ? 'default' : 'secondary'}>
                {habit.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accountability Score</span>
                <span className={habit.accountabilityScore >= 0 ? 'text-green-500' : 'text-destructive'}>
                  {habit.accountabilityScore}
                </span>
              </div>
              
              <Progress 
                value={habit.accountabilityScore > 0 ? Math.min(habit.accountabilityScore * 10, 100) : 0} 
                className="h-2" 
              />
              
              <div className="text-sm text-muted-foreground mt-2">
                Status: {habit.completedToday ? 'Completed today' : 'Not completed today'}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <Button
              variant={habit.completedToday ? "outline" : "default"}
              size="sm"
              onClick={() => toggleHabitCompletion(habit.id)}
            >
              <Check className="mr-1 h-4 w-4" />
              {habit.completedToday ? 'Mark incomplete' : 'Mark complete'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deleteHabit(habit.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default HabitList;
