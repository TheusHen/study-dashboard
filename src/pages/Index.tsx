import StudyCalendar from "@/components/StudyCalendar";
import SubjectChart from "@/components/SubjectChart";
import StudyStats from "@/components/StudyStats";
import { ArrowLeft, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Navigation buttons */}
      <div className="flex justify-between items-center mb-6">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <a
            href="https://www.theushen.me"
            rel="noopener noreferrer"
          >
            <ArrowLeft className="h-4 w-4" />
            theushen.me
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <a
            href="https://github.com/TheusHen/study-dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </Button>
      </div>

      {/* Header with animation */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Study Dashboard
          </h1>
        </div>
        <p className="text-xl text-muted-foreground">
          TheusHen's progress and maintain consistency in studies
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
    </div>
  );
};

export default Index;
