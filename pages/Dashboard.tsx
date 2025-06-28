
import { useUserProgress } from "@/context/UserProgressContext";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, CalendarDays, Star } from "lucide-react";

const Dashboard = () => {
  const { 
    skillRating, 
    achievements, 
    streak, 
    completedScenarios,
    userLevel 
  } = useUserProgress();

  // Calculate percentage through current level
  const calculateLevelProgress = () => {
    const range = userLevel.maxSkillRating - userLevel.minSkillRating;
    const progress = skillRating - userLevel.minSkillRating;
    return Math.floor((progress / range) * 100);
  };

  // Get unlocked achievements
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Therapist Dashboard</h1>
        <p className="text-gray-600">Track your progress and achievements</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Career Level Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-psycho-500" />
              Career Level
            </CardTitle>
            <CardDescription>Your current professional standing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-psycho-600 mb-2">{userLevel.title}</div>
            <div className="text-sm text-gray-500 mb-2">
              {skillRating} / {userLevel.maxSkillRating} skill points
            </div>
            <Progress value={calculateLevelProgress()} className="h-2 mt-2" />
            {userLevel.title !== "Certified Practitioner" && (
              <div className="text-xs text-gray-500 mt-2">
                {userLevel.maxSkillRating - skillRating} points until next level
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Streak Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-psycho-500" />
              Practice Streak
            </CardTitle>
            <CardDescription>Your daily commitment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-psycho-500">{streak}</span>
              <span className="text-xl text-gray-500 mb-1">days</span>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {streak > 0 ? "Keep going! Practice every day to maintain your streak." : "Start your streak by completing a session today!"}
            </div>
          </CardContent>
        </Card>
        
        {/* Sessions Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Star className="h-5 w-5 mr-2 text-psycho-500" />
              Sessions Completed
            </CardTitle>
            <CardDescription>Your therapy experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-psycho-500">
              {completedScenarios.length}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {completedScenarios.length === 0 
                ? "Complete your first session to start your journey!" 
                : "Great progress! Keep practicing with different scenarios."}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Achievements Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Award className="h-6 w-6 mr-2 text-psycho-500" />
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`${achievement.unlocked ? "border-psycho-300" : "opacity-70"}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div 
                    className={`p-3 rounded-lg mr-4 ${
                      achievement.unlocked ? "bg-psycho-100 text-psycho-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {achievement.icon === "award" && <Award className="h-6 w-6" />}
                    {achievement.icon === "trophy" && <Trophy className="h-6 w-6" />}
                    {achievement.icon === "star" && <Star className="h-6 w-6" />}
                    {achievement.icon === "calendar-check" && <CalendarDays className="h-6 w-6" />}
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      {achievement.unlocked && (
                        <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    {achievement.total && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">
                          Progress: {achievement.progress || 0}/{achievement.total}
                        </div>
                        <Progress 
                          value={((achievement.progress || 0) / achievement.total) * 100} 
                          className="h-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
