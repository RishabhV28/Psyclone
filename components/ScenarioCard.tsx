
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUserProgress } from "@/context/UserProgressContext";

interface ScenarioCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Boss";
  tags: string[];
  requiredSkillRating?: number;
}

const ScenarioCard = ({ 
  id, 
  title, 
  description, 
  category, 
  difficulty, 
  tags,
  requiredSkillRating = 0
}: ScenarioCardProps) => {
  const { skillRating, completedScenarios } = useUserProgress();
  const isLocked = requiredSkillRating > skillRating;
  const isCompleted = completedScenarios.includes(id);

  const difficultyColor = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
    Boss: "bg-purple-100 text-purple-800",
  };

  return (
    <Card className={`h-full flex flex-col ${isLocked ? 'opacity-70' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Completed
              </Badge>
            )}
          </div>
          <Badge variant="outline" className={difficultyColor[difficulty]}>
            {difficulty}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {category}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm">{description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {requiredSkillRating > 0 && (
          <div className="mt-3 text-xs text-gray-500">
            Required skill rating: {requiredSkillRating}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isLocked ? (
          <Link to={`/chat/${id}`} className="w-full">
            <Button className="w-full bg-psycho-500 hover:bg-psycho-600">
              <MessageCircle className="mr-2 h-4 w-4" />
              Start Practice
            </Button>
          </Link>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="w-full bg-gray-400 cursor-not-allowed" disabled>
                  <Lock className="mr-2 h-4 w-4" />
                  Locked
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Requires {requiredSkillRating} skill rating to unlock</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
};

export default ScenarioCard;
