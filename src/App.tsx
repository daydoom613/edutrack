import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/student/Dashboard";
import TeacherDashboard from "./pages/teacher/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentMaterials from "./pages/student/Materials";
import TeacherResources from "./pages/teacher/Resources";
import TeacherQuizzes from "./pages/teacher/Quizzes";
import StudentAssignments from "./pages/student/Assignments";
import StudentAIAssistant from "./pages/student/AIAssistant";
import TeacherAITools from "./pages/teacher/AITools";
import StudentProgress from "./pages/student/Progress";
import TeacherAnalytics from "./pages/teacher/Analytics";
import TeacherStudents from "./pages/teacher/Students";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route path="/student" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/materials" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <StudentMaterials />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/assignments" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <StudentAssignments />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/ai-assistant" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <StudentAIAssistant />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/progress" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <StudentProgress />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/notes" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">My Notes</h1>
                  <p className="text-muted-foreground mt-2">Manage your personal notes.</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/challenges" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Challenges</h1>
                  <p className="text-muted-foreground mt-2">Participate in learning challenges.</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Profile</h1>
                  <p className="text-muted-foreground mt-2">Manage your account settings.</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />

          {/* Teacher routes */}
          <Route path="/teacher" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <TeacherDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/resources" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <TeacherResources />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/quizzes" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <TeacherQuizzes />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/ai-tools" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <TeacherAITools />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/analytics" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <TeacherAnalytics />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/students" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <TeacherStudents />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/profile" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Profile</h1>
                  <p className="text-muted-foreground mt-2">Manage your account settings.</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />

          {/* Catch-all routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
