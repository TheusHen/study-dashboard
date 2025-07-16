import StudyCalendar from "@/components/StudyCalendar";
import SubjectChart from "@/components/SubjectChart";
import StudyStats from "@/components/StudyStats";
import { GraduationCap, Sparkles, ArrowLeft, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Navigation buttons */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Github className="h-4 w-4" />
          GitHub
        </Button>
      </div>

      {/* Header with animation */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <GraduationCap className="h-8 w-8 text-primary animate-glow" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Study Dashboard
          </h1>
          <Sparkles className="h-8 w-8 text-accent animate-glow" />
        </div>
        <p className="text-xl text-muted-foreground">
          Track your progress and maintain consistency in your studies
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-8">
        <StudyStats />
      </div>

      {/* Main container with calendar and chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Study calendar */}
        <div className="space-y-6">
          <StudyCalendar />
        </div>

        {/* Frequency chart */}
        <div className="space-y-6">
          <SubjectChart />
        </div>
      </div>

      {/* Footer with glow effect */}
      <div className="mt-12 text-center animate-fade-in">
        <div className="inline-block px-6 py-3 bg-gradient-card rounded-full border border-border shadow-glow">
          <p className="text-sm text-muted-foreground">
            Keep studying to maintain your streak! 🔥
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
