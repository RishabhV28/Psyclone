
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy } from "lucide-react";
import { useUserProgress } from "@/context/UserProgressContext";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Enhanced scenario data with difficulty levels
const scenarioData = {
  "anxiety-disorder": {
    title: "Generalized Anxiety Disorder",
    patientName: "Alex",
    difficulty: "Beginner",
    skillReward: 100
  },
  "depression": {
    title: "Major Depressive Disorder",
    patientName: "Jordan",
    difficulty: "Intermediate",
    skillReward: 150
  },
  "grief-counseling": {
    title: "Grief Counseling",
    patientName: "Morgan",
    difficulty: "Intermediate",
    skillReward: 200
  },
  "relationship-conflict": {
    title: "Relationship Conflict",
    patientName: "Taylor",
    difficulty: "Advanced",
    skillReward: 250
  },
  "substance-use": {
    title: "Alcohol Use Disorder",
    patientName: "Casey",
    difficulty: "Advanced",
    skillReward: 300
  },
  "bipolar-disorder": {
    title: "Bipolar Disorder",
    patientName: "Riley",
    difficulty: "Advanced",
    skillReward: 350
  },
  "schizophrenia": {
    title: "Schizophrenia",
    patientName: "Jamie",
    difficulty: "Boss",
    skillReward: 400
  },
  "borderline-personality": {
    title: "Borderline Personality Disorder",
    patientName: "Avery",
    difficulty: "Boss",
    skillReward: 500
  }
};

const Chat = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<{
    title: string;
    patientName: string;
    difficulty: string;
    skillReward: number;
  } | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const { updateSkillRating, markScenarioCompleted, unlockAchievement, updateAchievementProgress } = useUserProgress();

  useEffect(() => {
    if (!scenarioId || !scenarioData[scenarioId as keyof typeof scenarioData]) {
      navigate("/scenarios");
      return;
    }

    setScenario(scenarioData[scenarioId as keyof typeof scenarioData]);
  }, [scenarioId, navigate]);

  // Handle session completion
  const handleCompleteSession = () => {
    if (!scenario || sessionCompleted) return;
    
    // Mark session as completed
    setSessionCompleted(true);
    setShowCompletionDialog(true);
    
    // Update user progress
    updateSkillRating(scenario.skillReward);
    markScenarioCompleted(scenarioId || "");
    
    // Update achievements progress
    if (scenario.difficulty === "Boss") {
      unlockAchievement("boss-patient");
    }
    
    // Update empathy master achievement progress (simulating high empathy)
    const highEmpathyScore = Math.random() > 0.3; // 70% chance of high empathy
    if (highEmpathyScore) {
      updateAchievementProgress("empathy-master", 1);
    }
  };

  if (!scenario) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psycho-500"></div>
      </div>
    );
  }

  // Get difficulty color for display
  const difficultyColor = {
    "Beginner": "bg-green-100 text-green-800",
    "Intermediate": "bg-yellow-100 text-yellow-800",
    "Advanced": "bg-red-100 text-red-800",
    "Boss": "bg-purple-100 text-purple-800",
  };

  return (
    <div className="container mx-auto px-0 sm:px-4 py-4 max-w-6xl">
      <div className="mb-4 px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/scenarios")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex-grow">
            <h1 className="text-xl font-bold">{scenario.title}</h1>
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground mr-2">
                Patient: {scenario.patientName}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded ${difficultyColor[scenario.difficulty as keyof typeof difficultyColor]}`}>
                {scenario.difficulty}
              </span>
              <span className="text-xs ml-2 text-gray-500">
                +{scenario.skillReward} skill points
              </span>
            </div>
          </div>
          {!sessionCompleted && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCompleteSession}
              className="ml-2"
            >
              Complete Session
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border">
        <ChatInterface
          scenarioId={scenarioId || ""}
          patientName={scenario.patientName}
        />
      </div>
      
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              Session Completed!
            </DialogTitle>
            <DialogDescription>
              Great job completing this therapy session!
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Experience gained</span>
              <span className="text-sm font-semibold">+{scenario.skillReward} points</span>
            </div>
            <Progress value={100} className="h-2" />
            
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              <p className="text-sm font-medium mb-2">Session Summary:</p>
              <p className="text-sm text-gray-600">
                You completed a {scenario.difficulty.toLowerCase()} level session for {scenario.title} with patient {scenario.patientName}.
                Continue practicing with different scenarios to improve your therapeutic skills.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={() => {
                setShowCompletionDialog(false);
                navigate("/scenarios");
              }}
            >
              Return to Scenarios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
