import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface StudyDay {
  date: Date;
  studied: boolean;
  subjects?: string[];
}

const StudyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Dados de exemplo - dias de estudo
  const studyData: StudyDay[] = [
    { date: new Date(2024, 11, 1), studied: true, subjects: ['Matemática', 'Física'] },
    { date: new Date(2024, 11, 2), studied: false },
    { date: new Date(2024, 11, 3), studied: true, subjects: ['Química'] },
    { date: new Date(2024, 11, 4), studied: true, subjects: ['História', 'Geografia'] },
    { date: new Date(2024, 11, 5), studied: false },
    { date: new Date(2024, 11, 6), studied: true, subjects: ['Inglês'] },
    { date: new Date(2024, 11, 7), studied: true, subjects: ['Matemática', 'Português'] },
    { date: new Date(2024, 11, 8), studied: false },
    { date: new Date(2024, 11, 9), studied: true, subjects: ['Física', 'Química'] },
    { date: new Date(2024, 11, 10), studied: true, subjects: ['Biologia'] },
    { date: new Date(2024, 11, 11), studied: false },
    { date: new Date(2024, 11, 12), studied: true, subjects: ['História'] },
    { date: new Date(2024, 11, 13), studied: true, subjects: ['Matemática', 'Inglês'] },
    { date: new Date(2024, 11, 14), studied: false },
    { date: new Date(2024, 11, 15), studied: true, subjects: ['Geografia', 'Português'] },
  ];

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

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
              Calendário de Estudos
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
            const studyData = getStudyDataForDate(day);
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
                  ${studyData ? 
                    studyData.studied 
                      ? 'bg-success/20 border border-success text-success-foreground hover:bg-success/30 animate-pulse-success' 
                      : 'bg-error/20 border border-error text-error-foreground hover:bg-error/30 animate-pulse-error'
                    : 'bg-secondary/20 hover:bg-secondary/30 border border-border'
                  }
                `}
                title={studyData?.subjects?.join(', ') || ''}
              >
                <span className="text-sm font-medium">{day.getDate()}</span>
                {studyData && (
                  <div className="absolute top-1 right-1">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        studyData.studied ? 'bg-success' : 'bg-error'
                      }`}
                    />
                  </div>
                )}
                {studyData?.subjects && studyData.subjects.length > 0 && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="text-xs opacity-70 truncate">
                      {studyData.subjects[0]}
                      {studyData.subjects.length > 1 && ` +${studyData.subjects.length - 1}`}
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
            <span className="text-sm text-success-foreground">Estudou</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-error animate-pulse-error" />
            <span className="text-sm text-error-foreground">Não estudou</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyCalendar;