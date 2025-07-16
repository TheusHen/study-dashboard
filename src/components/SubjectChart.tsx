import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface SubjectData {
  subject: string;
  days: number;
  color: string;
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#22c55e',
  Physics: '#3b82f6',
  Chemistry: '#8b5cf6',
  History: '#f59e0b',
  Geography: '#ef4444',
  English: '#06b6d4',
  Literature: '#ec4899',
  Biology: '#10b981',
};

const SubjectChart = () => {
  const [subjectData, setSubjectData] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      // Busca todas as sessões de estudo e conta por subject
      const { data, error } = await supabase
        .from("study_sessions")
        .select("subject");

      if (data) {
        const subjectCount: Record<string, number> = {};
        data.forEach((row: any) => {
          if (row.subject) {
            subjectCount[row.subject] = (subjectCount[row.subject] || 0) + 1;
          }
        });

        setSubjectData(
          Object.entries(subjectCount).map(([subject, days]) => ({
            subject,
            days,
            color: SUBJECT_COLORS[subject] || "#8884d8",
          }))
        );
      }
      setLoading(false);
    };

    fetchSubjects();
  }, []);

  const totalDays = subjectData.reduce((sum, item) => sum + item.days, 0);
  const maxDays = Math.max(...subjectData.map(item => item.days), 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalDays ? ((data.days / totalDays) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-card-foreground font-medium">{label}</p>
          <p className="text-primary">
            <span className="font-medium">{data.days} days</span>
            <span className="text-muted-foreground ml-2">({percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-gradient-card shadow-glow animate-fade-in border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Subject Frequency
          </CardTitle>
        </div>
        <p className="text-muted-foreground">
          Total of {totalDays} study days distributed among subjects
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={subjectData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="subject" 
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="hsl(var(--foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="days" 
                radius={[4, 4, 0, 0]}
                className="transition-all duration-300"
              >
                {subjectData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="hover:opacity-80 cursor-pointer transition-opacity duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Days</span>
            </div>
            <span className="text-2xl font-bold text-primary">{totalDays}</span>
          </div>
          <div className="bg-success/10 rounded-lg p-4 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Most Studied</span>
            </div>
            <span className="text-lg font-bold text-success">
              {subjectData.find(s => s.days === maxDays)?.subject}
            </span>
          </div>
          <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Subjects</span>
            </div>
            <span className="text-2xl font-bold text-warning">{subjectData.length}</span>
          </div>
          <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Avg/Subject</span>
            </div>
            <span className="text-2xl font-bold text-accent">
              {subjectData.length ? (totalDays / subjectData.length).toFixed(1) : 0}
            </span>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-lg font-medium mb-3 text-foreground">Subject Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {subjectData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded hover:bg-secondary/20 transition-colors">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground truncate">{item.subject}</span>
                <span className="text-xs text-muted-foreground ml-auto">{item.days}d</span>
              </div>
            ))}
          </div>
        </div>
        {loading && <div className="text-center mt-4 text-muted-foreground">Loading...</div>}
      </CardContent>
    </Card>
  );
};

export default SubjectChart;