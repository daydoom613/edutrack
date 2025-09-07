import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, GraduationCap, Users, Brain, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-foreground">EduTrack</h1>
            </div>

            {/* Hero Text */}
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                The Future of <span className="bg-gradient-primary bg-clip-text text-transparent">Learning</span> is Here
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Empower students and teachers with AI-driven learning tools, interactive content, and comprehensive progress tracking.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button size="lg" className="btn-hero text-lg px-8" asChild>
                <Link to="/register">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-education-blue/10 rounded-full blur-xl" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-education-purple/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-education-green/10 rounded-full blur-xl" />
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Designed for Modern Education
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools for students and teachers to enhance the learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Student Features */}
          <div className="card-elevated p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-education-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-education-blue" />
            </div>
            <h4 className="text-xl font-semibold mb-2">For Students</h4>
            <p className="text-muted-foreground">
              Access materials, track progress, submit assignments, and get AI-powered help
            </p>
          </div>

          <div className="card-elevated p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-education-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-education-purple" />
            </div>
            <h4 className="text-xl font-semibold mb-2">For Teachers</h4>
            <p className="text-muted-foreground">
              Create content, manage students, analyze performance, and use AI tools
            </p>
          </div>

          <div className="card-elevated p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-education-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-education-green" />
            </div>
            <h4 className="text-xl font-semibold mb-2">AI-Powered</h4>
            <p className="text-muted-foreground">
              Smart assistance for both learning and teaching with cutting-edge AI
            </p>
          </div>

          <div className="card-elevated p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-education-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-education-orange" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Analytics</h4>
            <p className="text-muted-foreground">
              Comprehensive insights into learning progress and performance metrics
            </p>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="bg-card border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Try Our Demo
            </h3>
            <p className="text-xl text-muted-foreground">
              Experience EduTrack with our demo accounts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="card-elevated p-8 text-center">
              <div className="w-20 h-20 bg-education-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-education-blue" />
              </div>
              <h4 className="text-2xl font-semibold mb-4">Student Experience</h4>
              <p className="text-muted-foreground mb-6">
                Explore the student dashboard, assignments, AI assistant, and progress tracking
              </p>
              <Button className="btn-hero w-full" asChild>
                <Link to="/login">Try Student Demo</Link>
              </Button>
            </div>

            <div className="card-elevated p-8 text-center">
              <div className="w-20 h-20 bg-education-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-education-purple" />
              </div>
              <h4 className="text-2xl font-semibold mb-4">Teacher Experience</h4>
              <p className="text-muted-foreground mb-6">
                Discover resource management, student analytics, quiz creation, and AI tools
              </p>
              <Button className="btn-hero w-full" asChild>
                <Link to="/login">Try Teacher Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EduTrack</span>
          </div>
          <p className="text-muted">
            © 2025 EduTrack. Built for the future of education.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
