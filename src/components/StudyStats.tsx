import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Calendar, Flame } from "lucide-react";

const StudyStats = () => {
  // Sample statistics data
  const stats = {
    totalDays: 15,
    studiedDays: 10,
    consecutiveDays: 3,
    monthGoal: 20,
    studyStreak: 5,
    completionRate: 67
  };

  const studyPercentage = (stats.studiedDays / stats.totalDays) * 100;
  const goalPercentage = (stats.studiedDays / stats.monthGoal) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {/* Study Rate Card */}
      <Card className="bg-gradient-card shadow-glow border-border hover:shadow-success transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Study Rate</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-success">
              {studyPercentage.toFixed(1)}%
            </div>
            <Progress 
              value={studyPercentage} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {stats.studiedDays} of {stats.totalDays} days studied
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Goal Card */}
      <Card className="bg-gradient-card shadow-glow border-border hover:shadow-glow transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Monthly Goal</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-primary">
              {stats.studiedDays}/{stats.monthGoal}
            </div>
            <Progress 
              value={goalPercentage} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {goalPercentage.toFixed(1)}% of goal achieved
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Streak Card */}
      <Card className="bg-gradient-card shadow-glow border-border hover:shadow-error transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-warning" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-warning">
              {stats.studyStreak}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-6 rounded-full transition-all duration-300 ${
                    i < stats.studyStreak 
                      ? 'bg-warning animate-glow' 
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.studyStreak} consecutive days
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Best Streak Card */}
      <Card className="bg-gradient-card shadow-glow border-border hover:shadow-glow transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Best Streak</CardTitle>
            <Trophy className="h-4 w-4 text-accent" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-accent">
              {stats.consecutiveDays}
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-3 w-3 text-accent" />
              <span className="text-xs text-accent">Personal record</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your best performance
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyStats;