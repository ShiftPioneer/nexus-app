import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import TaskList from "./TaskList";
import { GTDTask } from "../../GTDContext";
interface OrganizeCardProps {
  title: string;
  tasks: GTDTask[];
  droppableId: string;
}
const OrganizeCard: React.FC<OrganizeCardProps> = ({
  title,
  tasks,
  droppableId
}) => <Card className="bg-slate-900 border-slate-700 text-slate-200">
    <CardHeader className="p-4 pb-2 bg-slate-950 rounded-lg">
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg text-orange-600">{title}</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#FF5722]">
          +
        </Button>
      </div>
      <div className="flex gap-2 items-center">
        <Input placeholder="Search tasks..." className="h-8 border-slate-700 text-slate-200 bg-slate-900" />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-4 pt-2 bg-slate-950 rounded-lg">
      <TaskList tasks={tasks} droppableId={droppableId} />
    </CardContent>
  </Card>;
export default OrganizeCard;