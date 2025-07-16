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

const StudyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [studyData, setStudyData] = useState<StudyDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudyData = async () => {
      setLoading(true);
      // Busca todas as sessões da tabela study_sessions
      const { data, error } = await supabase
        .from("study_sessions")
        .select("timestamp,subject");

      if (data) {
        // Agrupa por dia
        const daysMap: Record<string, StudyDay> = {};
        data.forEach((item: any) => {
          const dateStr = new Date(item.timestamp).toDateString();
          if (!daysMap[dateStr]) {
            daysMap[dateStr] = { date: new Date(item.timestamp), studied: true, subjects: [] };
          }
          if (item.subject) {
            daysMap[dateStr].subjects?.push(item.subject);
          }
        });

        setStudyData(Object.values(daysMap));
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

  const getStudyDataForDate = (date: Date) => {
    return studyData.find(data => 
      data.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <Card className="w-full bg-gradient-card shadow-glow animate-fade-in border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Study Calendar
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-primary/20 transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="hover:bg-primary/20 transition-all duration-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const studyDataDay = getStudyDataForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`
                  relative p-3 rounded-lg text-center cursor-pointer transition-all duration-300 
                  group hover:scale-105 min-h-[50px] flex items-center justify-center
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${isToday ? 'ring-2 ring-primary animate-glow' : ''}
                  ${studyDataDay ? 
                    studyDataDay.studied 
                      ? 'bg-success/20 border border-success text-success-foreground hover:bg-success/30 animate-pulse-success' 
                      : 'bg-error/20 border border-error text-error-foreground hover:bg-error/30 animate-pulse-error'
                    : 'bg-secondary/20 hover:bg-secondary/30 border border-border'
                  }
                `}
                title={studyDataDay?.subjects?.join(', ') || ''}
              >
                <span className="text-sm font-medium">{day.getDate()}</span>
                {studyDataDay && (
                  <div className="absolute top-1 right-1">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        studyDataDay.studied ? 'bg-success' : 'bg-error'
                      }`}
                    />
                  </div>
                )}
                {studyDataDay?.subjects && studyDataDay.subjects.length > 0 && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="text-xs opacity-70 truncate">
                      {studyDataDay.subjects[0]}
                      {studyDataDay.subjects.length > 1 && ` +${studyDataDay.subjects.length - 1}`}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success animate-pulse-success" />
            <span className="text-sm text-success-foreground">Studied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-error animate-pulse-error" />
            <span className="text-sm text-error-foreground">Didn't study</span>
          </div>
        </div>
        {loading && <div className="text-center mt-4 text-muted-foreground">Loading...</div>}
      </CardContent>
    </Card>
  );
};

export default StudyCalendar;