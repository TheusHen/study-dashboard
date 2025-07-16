import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Calendar, Flame } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const StudyStats = () => {
  const [stats, setStats] = useState({
    totalDays: 0,
    studiedDays: 0,
    consecutiveDays: 0,
    monthGoal: 20,
    studyStreak: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from("study_sessions").select("timestamp");

      if (data) {
        // Agrupa por dia (apenas 1 registro por dia)
        const uniqueDates = Array.from(new Set(data.map((d: any) => new Date(d.timestamp).toDateString())));
        const studiedDays = uniqueDates.length;
        const totalDays = uniqueDates.length;

        // Streak (sequência) de dias consecutivos
        const sortedDates = uniqueDates
          .map(dateStr => new Date(dateStr))
          .sort((a, b) => a.getTime() - b.getTime());

        let bestStreak = 0;
        let currentStreak = 0;
        let streak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const diff = (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            streak++;
          } else {
            streak = 1;
          }
          if (streak > bestStreak) bestStreak = streak;
        }
        bestStreak = Math.max(bestStreak, streak);

        // Calcula streak atual (nos últimos dias até hoje)
        streak = 1;
        for (let i = sortedDates.length - 1; i > 0; i--) {
          const diff = (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            streak++;
          } else {
            break;
          }
        }
        currentStreak = streak;

        setStats({
          totalDays,
          studiedDays,
          consecutiveDays: bestStreak,
          monthGoal: 20,
          studyStreak: currentStreak,
          completionRate: totalDays ? (studiedDays / totalDays) * 100 : 0,
        });
      }
    };

    fetchStats();
  }, []);

  const studyPercentage = stats.totalDays ? (stats.studiedDays / stats.totalDays) * 100 : 0;
  const goalPercentage = stats.monthGoal ? (stats.studiedDays / stats.monthGoal) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
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