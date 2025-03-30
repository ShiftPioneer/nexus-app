
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit, Trash } from "lucide-react";

interface TimeDesignActivitiesProps {
  activities: TimeActivity[];
  onEditActivity: (activity: TimeActivity) => void;
  onDeleteActivity: (id: string) => void;
}

const TimeDesignActivities: React.FC<TimeDesignActivitiesProps> = ({
  activities,
  onEditActivity,
  onDeleteActivity,
}) => {
  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = format(activity.startDate, "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, TimeActivity[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedActivities).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const getCategoryBadge = (category: string) => {
    const styles = {
      work: "bg-purple-100 text-purple-800",
      social: "bg-orange-100 text-orange-800",
      health: "bg-green-100 text-green-800",
      learning: "bg-blue-100 text-blue-800",
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[category as keyof typeof styles]}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedDates.length > 0 ? (
          sortedDates.map(date => (
            <div key={date} className="space-y-4">
              <h3 className="font-semibold">
                {format(new Date(date), "EEEE, MMMM d, yyyy")}
              </h3>
              
              {groupedActivities[date]
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map(activity => (
                  <div
                    key={activity.id}
                    className="border rounded-lg p-4 relative hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-muted-foreground flex items-center">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                              <path
                                strokeLinecap="round"
                                strokeWidth="1.5"
                                d="M12 6v6l4 2"
                              />
                            </svg>
                            {activity.startTime} - {activity.endTime}
                          </span>
                          {getCategoryBadge(activity.category)}
                          {activity.syncWithGoogleCalendar && (
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">
                              Google Calendar
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditActivity(activity)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteActivity(activity.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No activities scheduled. Create a new activity to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeDesignActivities;
