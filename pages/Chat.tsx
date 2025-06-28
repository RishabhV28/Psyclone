import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Brain, Target } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface Message {
  id: string;
  content: string;
  isUserMessage: boolean;
  sender: string;
  timestamp: Date;
}

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
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [sessionSummary, setSessionSummary] = useState<string>("");
  const [techniqueAnalysis, setTechniqueAnalysis] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { updateSkillRating, markScenarioCompleted, unlockAchievement, updateAchievementProgress } = useUserProgress();

  useEffect(() => {
    if (!scenarioId || !scenarioData[scenarioId as keyof typeof scenarioData]) {
      navigate("/scenarios");
      return;
    }

    setScenario(scenarioData[scenarioId as keyof typeof scenarioData]);
  }, [scenarioId, navigate]);

  // Handle session completion
  const handleCompleteSession = async () => {
    if (!scenario || sessionCompleted) return;
    
    setIsGeneratingSummary(true);
    
    try {
      // Generate both session summary and technique analysis
      const [summary, analysis] = await Promise.all([
        generateSessionSummary(conversationMessages, scenario),
        generateTechniqueAnalysis(conversationMessages)
      ]);
      
      setSessionSummary(summary);
      setTechniqueAnalysis(analysis);
    } catch (error) {
      console.error("Error generating analysis:", error);
      setSessionSummary("Unable to generate session summary.");
      setTechniqueAnalysis("Unable to generate technique analysis.");
    } finally {
      setIsGeneratingSummary(false);
    }
    
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

  // Generate session summary using Gemini API
  const generateSessionSummary = async (messages: Message[], scenario: any): Promise<string> => {
    try {
      const conversationText = messages
        .map(msg => `${msg.sender}: ${msg.content}`)
        .join('\n');

      const summaryPrompt = `As an expert therapy session analyst, provide a comprehensive analysis of this therapy session between a therapist and a patient with ${scenario.title}. 

ANALYSIS REQUIREMENTS:
1. **Session Overview** (2-3 sentences): Summarize the main focus and flow of the session
2. **Key Topics Discussed**: List the main themes and concerns addressed
3. **Patient's Presentation**: Describe the patient's emotional state and primary concerns
4. **Therapeutic Techniques Used**: Identify specific techniques the therapist employed (e.g., active listening, validation, reframing, etc.)
5. **Strengths**: Highlight what the therapist did well
6. **Areas for Improvement**: Suggest specific ways the therapist could enhance their approach
7. **Overall Assessment**: Rate the session quality and provide a brief recommendation

CONVERSATION:
${conversationText}

Please provide a structured, professional analysis that would be helpful for a therapist's professional development:`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB7TvNcWLOo5iLZv_xWWMxm9kcxegv3uQs`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: summaryPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 800,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Summary generation failed.";
    } catch (error) {
      console.error("Summary generation error:", error);
      return "Unable to generate session summary at this time.";
    }
  };

  // Generate therapeutic technique analysis
  const generateTechniqueAnalysis = async (messages: Message[]): Promise<string> => {
    try {
      const conversationText = messages
        .filter(msg => msg.isUserMessage) // Only therapist messages
        .map(msg => msg.content)
        .join('\n');

      const techniquePrompt = `Analyze the therapeutic techniques used in this therapy session. 

Identify and evaluate:
1. **Active Listening**: How well did the therapist demonstrate active listening?
2. **Empathy & Validation**: Was the therapist empathetic and validating?
3. **Questioning Techniques**: What types of questions were used (open-ended, closed, clarifying)?
4. **Reframing**: Did the therapist help reframe the patient's perspective?
5. **Goal Setting**: Was there any goal setting or action planning?
6. **Crisis Management**: How did the therapist handle any crisis moments?
7. **Cultural Sensitivity**: Was the approach culturally appropriate?

THERAPIST RESPONSES:
${conversationText}

Provide specific examples and suggestions for improvement:`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB7TvNcWLOo5iLZv_xWWMxm9kcxegv3uQs`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: techniquePrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 600,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate technique analysis");
      }

      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Technique analysis failed.";
    } catch (error) {
      console.error("Technique analysis error:", error);
      return "Unable to generate technique analysis at this time.";
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
              disabled={isGeneratingSummary}
            >
              {isGeneratingSummary ? "Generating Summary..." : "Complete Session"}
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border">
        <ChatInterface
          scenarioId={scenarioId || ""}
          patientName={scenario.patientName}
          onMessagesUpdate={setConversationMessages}
        />
      </div>
      
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <Trophy className="h-6 w-6 text-yellow-500 mr-3" />
              Session Completed!
            </DialogTitle>
            <DialogDescription className="text-base">
              Great job completing this therapy session! Here's your comprehensive review.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            {/* Experience Points Section */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Experience gained</span>
                <span className="text-lg font-bold text-green-600">+{scenario.skillReward} points</span>
              </div>
              <Progress value={100} className="h-3 bg-green-100" />
              <div className="mt-2 text-xs text-gray-600">
                Level {Math.floor(scenario.skillReward / 100) + 1} • {scenario.difficulty} difficulty
              </div>
            </div>
            
            {isGeneratingSummary ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-psycho-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-lg font-medium text-gray-700">Generating comprehensive session analysis...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="summary" 
                      className="flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-psycho-600"
                    >
                      <Brain className="h-4 w-4" />
                      <span className="font-medium">Session Summary</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="techniques" 
                      className="flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-psycho-600"
                    >
                      <Target className="h-4 w-4" />
                      <span className="font-medium">Technique Analysis</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="mt-6">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-psycho-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Brain className="h-5 w-5 text-psycho-600 mr-2" />
                          Session Analysis
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Comprehensive overview of your therapy session
                        </p>
                      </div>
                      <div className="p-6">
                        <div className="prose prose-sm max-w-none">
                          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {sessionSummary || "Session summary will appear here after completion."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="techniques" className="mt-6">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Target className="h-5 w-5 text-green-600 mr-2" />
                          Therapeutic Techniques
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Detailed analysis of techniques used and areas for improvement
                        </p>
                      </div>
                      <div className="p-6">
                        <div className="prose prose-sm max-w-none">
                          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {techniqueAnalysis || "Technique analysis will appear here after completion."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Session Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-psycho-600">{conversationMessages.filter(m => m.isUserMessage).length}</div>
                    <div className="text-sm text-gray-600">Your Responses</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{conversationMessages.filter(m => !m.isUserMessage).length}</div>
                    <div className="text-sm text-gray-600">Patient Responses</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{scenario.difficulty}</div>
                    <div className="text-sm text-gray-600">Difficulty Level</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="border-t pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowCompletionDialog(false);
                navigate("/scenarios");
              }}
              className="mr-2"
            >
              Back to Scenarios
            </Button>
            <Button
              onClick={() => {
                setShowCompletionDialog(false);
                navigate("/dashboard");
              }}
              className="bg-psycho-500 hover:bg-psycho-600"
            >
              View Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
