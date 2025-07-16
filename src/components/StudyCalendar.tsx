import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface StudyDay {
  date: Date;
  studied: boolean;
  subjects?: string[];
}

const CREATION_DATE = new Date("2025-07-15T00:00:00Z");

const StudyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [studyData, setStudyData] = useState<StudyDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    const fetchStudyData = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("study_sessions")
        .select("timestamp,subject");

      if (data) {
        const daysMap: Record<string, StudyDay> = {};
        data.forEach((item: any) => {
          const date = new Date(item.timestamp);
          if (date < CREATION_DATE) return;
          const dateStr = date.toDateString();
          if (!daysMap[dateStr]) {
            daysMap[dateStr] = { date, studied: true, subjects: [] };
          }
          if (item.subject) {
            daysMap[dateStr].subjects?.push(item.subject);
          }
        });

        setStudyData(Object.values(daysMap));

        // Calcula o maior streak desde CREATION_DATE
        // Crie um Set de todos os dias estudados
        const studiedDaysSet = new Set(
          Object.values(daysMap).map(d => {
            const dt = new Date(d.date);
            dt.setHours(0, 0, 0, 0);
            return dt.getTime();
          })
        );

        // Comece de CREATION_DATE até ontem (ou até hoje, se preferir)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let streak = 0;
        let maxStreakCalc = 0;
        let d = new Date(CREATION_DATE);
        d.setHours(0, 0, 0, 0);

        while (d <= today) {
          if (studiedDaysSet.has(d.getTime())) {
            streak += 1;
            maxStreakCalc = Math.max(maxStreakCalc, streak);
          } else {
            streak = 0;
          }
          d.setDate(d.getDate() + 1);
        }

        // No caso de só um dia estudado, streak = 1
        if (studiedDaysSet.size === 1) maxStreakCalc = 1;

        setMaxStreak(maxStreakCalc);

        // Salva no banco o valor correto
        await supabase
          .from("study_current_streak")
          .upsert({ id: 1, current_streak: maxStreakCalc }, { onConflict: 'id' });
      }
      setLoading(false);
    };

    fetchStudyData();
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const getStudyDataForDate = (date: Date): StudyDay | undefined => {
    if (date < CREATION_DATE) return undefined;
    const found = studyData.find(data =>
      data.date.toDateString() === date.toDateString()
    );
    if (found) return found;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    if (dateOnly < today) {
      return { date, studied: false, subjects: [] };
    }
    return undefined;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <Card className="w-full bg-gradient-card shadow-glow animate-fade-in border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl md:text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Study Calendar
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-primary/20 transition-all duration-300"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-base md:text-lg font-medium min-w-[100px] md:min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="hover:bg-primary/20 transition-all duration-300"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center font-medium text-muted-foreground py-1 text-xs md:text-base">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {days.map((day, index) => {
            const studyDataDay = getStudyDataForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();

            if (day < CREATION_DATE) {
              return (
                <div
                  key={index}
                  className={`
                    relative p-1 md:p-3 rounded-lg text-center min-h-[32px] md:min-h-[50px] flex items-center justify-center
                    ${!isCurrentMonth ? 'opacity-30' : ''}
                  `}
                >
                  <span className="text-xs md:text-sm font-medium">{day.getDate()}</span>
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`
                  relative p-1 md:p-3 rounded-lg text-center cursor-pointer transition-all duration-300 
                  group hover:scale-105 min-h-[32px] md:min-h-[50px] flex items-center justify-center
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${isToday ? 'ring-2 ring-primary animate-glow' : ''}
                  ${studyDataDay
                    ? (studyDataDay.studied
                        ? 'bg-success/20 border border-success text-success-foreground hover:bg-success/30 animate-pulse-success'
                        : 'bg-error/20 border border-error text-error-foreground hover:bg-error/30'
                      )
                    : 'bg-secondary/20 hover:bg-secondary/30 border border-border'
                  }
                `}
                title={studyDataDay?.subjects?.join(', ') || (!studyDataDay?.studied && studyDataDay ? 'Não estudou' : '')}
              >
                <span className="text-xs md:text-sm font-medium">{day.getDate()}</span>
                {studyDataDay && (
                  <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1">
                    <div
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                        studyDataDay.studied ? 'bg-success animate-pulse-success' : 'bg-error'
                      }`}
                    />
                  </div>
                )}
                {studyDataDay?.subjects && studyDataDay.subjects.length > 0 && (
                  <div className="absolute bottom-0.5 left-0.5 right-0.5 md:bottom-1 md:left-1 md:right-1">
                    <div className="text-[10px] md:text-xs opacity-70 truncate">
                      {studyDataDay.subjects[0]}
                      {studyDataDay.subjects.length > 1 && ` +${studyDataDay.subjects.length - 1}`}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mt-4 md:mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-success animate-pulse-success" />
            <span className="text-xs md:text-sm text-success-foreground">Studied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-error" />
            <span className="text-xs md:text-sm text-error-foreground">Didn't study</span>
          </div>
        </div>
        <div className="mt-6 text-center text-md">
          <span className="font-semibold">Longest streak: </span>
          <span className={maxStreak > 0 ? "text-success" : "text-error"}>{maxStreak}</span> day{maxStreak !== 1 && "s"}
        </div>
        {loading && <div className="text-center mt-4 text-muted-foreground text-sm">Loading...</div>}
      </CardContent>
    </Card>
  );
};

export default StudyCalendar;