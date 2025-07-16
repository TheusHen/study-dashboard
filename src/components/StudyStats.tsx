import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Calendar, Flame } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface StreakRow {
  best_streak: number;
}

const getCurrentStreak = (dates: Date[], today: Date): number => {
  if (dates.length === 0) return 0;
  // Ordenar datas em ordem decrescente
  const sorted = [...dates].sort((a, b) => b.getTime() - a.getTime());
  let streak = 0;
  let current = new Date(today);
  current.setHours(0, 0, 0, 0);
  let i = 0;
  while (i < sorted.length) {
    if (sorted[i].toDateString() === current.toDateString()) {
      streak++;
      current.setDate(current.getDate() - 1);
      i++;
    } else if (sorted[i].getTime() < current.getTime()) {
      // Quebrou o streak
      break;
    } else {
      // Data futura ou repetida, avança
      i++;
    }
  }
  return streak;
};

const StudyStats = () => {
  const [stats, setStats] = useState({
    totalDays: 0,
    studiedDays: 0,
    didntStudyDays: 0,
    consecutiveDays: 0,
    monthGoal: 30,
    studyStreak: 0,
    completionRate: 0,
  });
  const [bestStreak, setBestStreak] = useState<number>(0);

  const fetchBestStreak = async () => {
    const { data } = await supabase
      .from("study_streaks")
      .select("best_streak")
      .eq("id", 1)
      .single();
    if (data) setBestStreak(data.best_streak);
  };

  useEffect(() => {
    fetchBestStreak();

    const fetchStats = async () => {
      const { data } = await supabase.from("study_sessions").select("timestamp");

      if (data) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sessionDates = data.map((d: any) => new Date(d.timestamp));
        const uniqueDatesSet = new Set(sessionDates.map(d => d.toDateString()));
        const studiedDays = uniqueDatesSet.size;

        const minDate = sessionDates.length
          ? new Date(Math.min(...sessionDates.map(d => d.getTime())))
          : today;
        minDate.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        let totalDays = 0;
        let didntStudyDays = 0;
        let d = new Date(minDate);
        while (d <= yesterday) {
          totalDays++;
          if (!uniqueDatesSet.has(d.toDateString())) didntStudyDays++;
          d.setDate(d.getDate() + 1);
        }

        const sortedDates = Array.from(uniqueDatesSet)
          .map(dateStr => new Date(dateStr))
          .sort((a, b) => a.getTime() - b.getTime());

        // Best Streak
        let bestStreakCalc = 0;
        let streak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const diff = (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
            streak++;
          } else {
            streak = 1;
          }
          if (streak > bestStreakCalc) bestStreakCalc = streak;
        }
        bestStreakCalc = Math.max(bestStreakCalc, streak);

        // Current Streak (corrigido)
        const currentStreak = getCurrentStreak(sessionDates, today);

        setStats({
          totalDays,
          studiedDays,
          didntStudyDays,
          consecutiveDays: bestStreakCalc,
          monthGoal: 30,
          studyStreak: currentStreak,
          completionRate: totalDays ? (studiedDays / totalDays) * 100 : 0,
        });

        // Atualiza best streak se necessário
        if (bestStreakCalc > bestStreak) {
          await supabase
            .from("study_streaks")
            .upsert({ id: 1, best_streak: bestStreakCalc }, { onConflict: 'id' });
          setBestStreak(bestStreakCalc);
        }

        // Salva current streak
        await supabase
          .from("study_current_streak")
          .upsert({ id: 1, current_streak: currentStreak }, { onConflict: "id" });
      }
    };

    fetchStats();
    // eslint-disable-next-line
  }, []);

  const studyPercentage = stats.totalDays + stats.didntStudyDays > 0
    ? (stats.studiedDays / (stats.studiedDays + stats.didntStudyDays)) * 100
    : 0;
  const goalPercentage = stats.monthGoal ? (stats.studiedDays / stats.monthGoal) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
      <Card className="bg-gradient-card shadow-glow border-border hover:shadow-success transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs md:text-sm text-muted-foreground">Study Rate</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 md:space-y-3">
            <div className="text-lg md:text-2xl font-bold text-success">
              {studyPercentage.toFixed(1)}%
            </div>
            <Progress value={studyPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats.studiedDays} Studied / {stats.didntStudyDays} Didn't study
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-card shadow-glow border-border hover:shadow-glow transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs md:text-sm text-muted-foreground">Monthly Goal</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 md:space-y-3">
            <div className="text-lg md:text-2xl font-bold text-primary">
              {stats.studiedDays}/{stats.monthGoal}
            </div>
            <Progress value={goalPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {goalPercentage.toFixed(1)}% of goal achieved
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-card shadow-glow border-border hover:shadow-error transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs md:text-sm text-muted-foreground">Current Streak</CardTitle>
            <Flame className={`h-4 w-4 ${stats.studyStreak > 4 ? 'text-success' : 'text-warning'}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 md:space-y-3">
            <div className={`text-lg md:text-2xl font-bold ${stats.studyStreak > 4 ? 'text-success' : 'text-warning'}`}>
              {stats.studyStreak}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-4 md:w-2 md:h-6 rounded-full transition-all duration-300 ${
                    i < stats.studyStreak
                      ? (stats.studyStreak > 4 ? 'bg-success animate-glow' : 'bg-warning animate-glow')
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
            <CardTitle className="text-xs md:text-sm text-muted-foreground">Best Streak</CardTitle>
            <Trophy className="h-4 w-4 text-accent" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 md:space-y-3">
            <div className="text-lg md:text-2xl font-bold text-accent">
              {bestStreak}
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-3 w-3 text-accent" />
              <span className="text-xs text-accent">Personal record</span>
            </div>
            <p className="text-xs text-muted-foreground">
              TheusHen best performance
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyStats;
