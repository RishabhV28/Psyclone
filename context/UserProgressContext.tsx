
import React, { createContext, useContext, useState, useEffect } from "react";

// Define types for our gamification system
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

export interface UserLevel {
  title: string;
  minSkillRating: number;
  maxSkillRating: number;
}

export interface UserProgressContextType {
  skillRating: number;
  updateSkillRating: (points: number) => void;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  updateAchievementProgress: (id: string, progress: number) => void;
  streak: number;
  incrementStreak: () => void;
  resetStreak: () => void;
  lastActiveDate: Date | null;
  completedScenarios: string[];
  markScenarioCompleted: (scenarioId: string) => void;
  userLevel: UserLevel;
}

// Career progression levels
const careerLevels: UserLevel[] = [
  { title: "Student Therapist", minSkillRating: 0, maxSkillRating: 999 },
  { title: "Clinic Intern", minSkillRating: 1000, maxSkillRating: 1999 },
  { title: "Certified Practitioner", minSkillRating: 2000, maxSkillRating: 3000 },
];

// Initial achievements
const initialAchievements: Achievement[] = [
  {
    id: "first-session",
    name: "First Session Completed",
    description: "Complete your first therapy session",
    icon: "award",
    unlocked: false
  },
  {
    id: "empathy-master",
    name: "Empathy Master",
    description: "Complete 5 sessions with high empathy ratings",
    icon: "heart",
    unlocked: false,
    progress: 0,
    total: 5
  },
  {
    id: "diagnostic-detective",
    name: "Diagnostic Detective",
    description: "Correctly identify 3 complex disorders",
    icon: "search",
    unlocked: false,
    progress: 0,
    total: 3
  },
  {
    id: "streak-7",
    name: "Weekly Dedication",
    description: "Maintain a 7-day practice streak",
    icon: "calendar-check",
    unlocked: false,
    progress: 0,
    total: 7
  },
  {
    id: "boss-patient",
    name: "Boss Challenger",
    description: "Successfully complete a session with a Boss Patient",
    icon: "trophy",
    unlocked: false
  }
];

// Create context with default values
const UserProgressContext = createContext<UserProgressContextType>({
  skillRating: 0,
  updateSkillRating: () => {},
  achievements: initialAchievements,
  unlockAchievement: () => {},
  updateAchievementProgress: () => {},
  streak: 0,
  incrementStreak: () => {},
  resetStreak: () => {},
  lastActiveDate: null,
  completedScenarios: [],
  markScenarioCompleted: () => {},
  userLevel: careerLevels[0],
});

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage if available
  const [skillRating, setSkillRating] = useState<number>(() => {
    const saved = localStorage.getItem("psyclone_skillRating");
    return saved ? parseInt(saved, 10) : 500; // Start at 500 by default
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem("psyclone_achievements");
    return saved ? JSON.parse(saved) : initialAchievements;
  });
  
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem("psyclone_streak");
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [lastActiveDate, setLastActiveDate] = useState<Date | null>(() => {
    const saved = localStorage.getItem("psyclone_lastActiveDate");
    return saved ? new Date(saved) : null;
  });
  
  const [completedScenarios, setCompletedScenarios] = useState<string[]>(() => {
    const saved = localStorage.getItem("psyclone_completedScenarios");
    return saved ? JSON.parse(saved) : [];
  });

  // Determine user level based on skill rating
  const [userLevel, setUserLevel] = useState<UserLevel>(() => {
    return careerLevels.find(level => 
      skillRating >= level.minSkillRating && skillRating <= level.maxSkillRating
    ) || careerLevels[0];
  });

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem("psyclone_skillRating", skillRating.toString());
    localStorage.setItem("psyclone_achievements", JSON.stringify(achievements));
    localStorage.setItem("psyclone_streak", streak.toString());
    if (lastActiveDate) {
      localStorage.setItem("psyclone_lastActiveDate", lastActiveDate.toISOString());
    }
    localStorage.setItem("psyclone_completedScenarios", JSON.stringify(completedScenarios));
  }, [skillRating, achievements, streak, lastActiveDate, completedScenarios]);

  // Update user level when skill rating changes
  useEffect(() => {
    const newLevel = careerLevels.find(level => 
      skillRating >= level.minSkillRating && skillRating <= level.maxSkillRating
    ) || careerLevels[0];
    
    setUserLevel(newLevel);
  }, [skillRating]);

  // Check and update streak every day
  useEffect(() => {
    if (!lastActiveDate) {
      setLastActiveDate(new Date());
      return;
    }

    const today = new Date();
    const lastActive = new Date(lastActiveDate);
    
    // Reset streak if more than 1 day has passed
    if ((today.getTime() - lastActive.getTime()) > 2 * 24 * 60 * 60 * 1000) {
      resetStreak();
    } 
    // Increment streak if it's a new day but not more than 1 day has passed
    else if (
      today.getDate() !== lastActive.getDate() || 
      today.getMonth() !== lastActive.getMonth() || 
      today.getFullYear() !== lastActive.getFullYear()
    ) {
      incrementStreak();
    }
    
    setLastActiveDate(today);
  }, []);

  const updateSkillRating = (points: number) => {
    setSkillRating(prev => {
      const newRating = Math.max(0, Math.min(3000, prev + points));
      return newRating;
    });
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === id ? { ...achievement, unlocked: true } : achievement
      )
    );
  };

  const updateAchievementProgress = (id: string, progress: number) => {
    setAchievements(prev => 
      prev.map(achievement => {
        if (achievement.id === id) {
          const updatedProgress = (achievement.progress || 0) + progress;
          const newAchievement = { 
            ...achievement, 
            progress: updatedProgress 
          };
          
          // Auto-unlock if reached the total
          if (achievement.total && updatedProgress >= achievement.total) {
            newAchievement.unlocked = true;
          }
          
          return newAchievement;
        }
        return achievement;
      })
    );
  };

  const incrementStreak = () => {
    setStreak(prev => prev + 1);
    
    // Check if we need to unlock streak achievement
    if (streak + 1 >= 7) {
      unlockAchievement('streak-7');
    }
  };

  const resetStreak = () => {
    setStreak(0);
  };

  const markScenarioCompleted = (scenarioId: string) => {
    if (!completedScenarios.includes(scenarioId)) {
      setCompletedScenarios(prev => [...prev, scenarioId]);
      
      // Unlock first session achievement if this is their first completion
      if (completedScenarios.length === 0) {
        unlockAchievement('first-session');
      }
    }
  };

  return (
    <UserProgressContext.Provider 
      value={{ 
        skillRating, 
        updateSkillRating, 
        achievements, 
        unlockAchievement,
        updateAchievementProgress,
        streak,
        incrementStreak,
        resetStreak,
        lastActiveDate,
        completedScenarios,
        markScenarioCompleted,
        userLevel
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = () => useContext(UserProgressContext);

export default UserProgressContext;
