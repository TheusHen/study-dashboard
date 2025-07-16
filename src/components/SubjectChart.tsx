import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, BookOpen } from "lucide-react";

interface SubjectData {
  subject: string;
  days: number;
  color: string;
}

const SubjectChart = () => {
  // Dados de exemplo das matérias estudadas
  const subjectData: SubjectData[] = [
    { subject: 'Matemática', days: 8, color: '#22c55e' },
    { subject: 'Física', days: 6, color: '#3b82f6' },
    { subject: 'Química', days: 5, color: '#8b5cf6' },
    { subject: 'História', days: 4, color: '#f59e0b' },
    { subject: 'Geografia', days: 3, color: '#ef4444' },
    { subject: 'Inglês', days: 5, color: '#06b6d4' },
    { subject: 'Português', days: 4, color: '#ec4899' },
    { subject: 'Biologia', days: 2, color: '#10b981' },
  ];

  const totalDays = subjectData.reduce((sum, item) => sum + item.days, 0);
  const maxDays = Math.max(...subjectData.map(item => item.days));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.days / totalDays) * 100).toFixed(1);
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-card-foreground font-medium">{label}</p>
          <p className="text-primary">
            <span className="font-medium">{data.days} dias</span>
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
            Frequência por Matéria
          </CardTitle>
        </div>
        <p className="text-muted-foreground">
          Total de {totalDays} dias de estudo distribuídos entre as matérias
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
        
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total de Dias</span>
            </div>
            <span className="text-2xl font-bold text-primary">{totalDays}</span>
          </div>
          
          <div className="bg-success/10 rounded-lg p-4 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Mais Estudada</span>
            </div>
            <span className="text-lg font-bold text-success">
              {subjectData.find(s => s.days === maxDays)?.subject}
            </span>
          </div>
          
          <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Matérias</span>
            </div>
            <span className="text-2xl font-bold text-warning">{subjectData.length}</span>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Média/Matéria</span>
            </div>
            <span className="text-2xl font-bold text-accent">
              {(totalDays / subjectData.length).toFixed(1)}
            </span>
          </div>
        </div>
        
        {/* Lista de matérias com cores */}
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-lg font-medium mb-3 text-foreground">Legenda das Matérias</h4>
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
      </CardContent>
    </Card>
  );
};

export default SubjectChart;