import StudyCalendar from "@/components/StudyCalendar";
import SubjectChart from "@/components/SubjectChart";
import StudyStats from "@/components/StudyStats";
import { GraduationCap, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Header com animação */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <GraduationCap className="h-8 w-8 text-primary animate-glow" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard de Estudos
          </h1>
          <Sparkles className="h-8 w-8 text-accent animate-glow" />
        </div>
        <p className="text-xl text-muted-foreground">
          Acompanhe seu progresso e mantenha a consistência nos estudos
        </p>
      </div>

      {/* Estatísticas */}
      <div className="mb-8">
        <StudyStats />
      </div>

      {/* Container principal com calendário e gráfico */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Calendário de estudos */}
        <div className="space-y-6">
          <StudyCalendar />
        </div>

        {/* Gráfico de frequência */}
        <div className="space-y-6">
          <SubjectChart />
        </div>
      </div>

      {/* Footer com efeito de brilho */}
      <div className="mt-12 text-center animate-fade-in">
        <div className="inline-block px-6 py-3 bg-gradient-card rounded-full border border-border shadow-glow">
          <p className="text-sm text-muted-foreground">
            Continue estudando para manter sua sequência! 🔥
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
