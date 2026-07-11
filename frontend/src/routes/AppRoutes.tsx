import { Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import HomePage from "../pages/HomePage";

// Auth
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Student
import AIAssistantPage from "../pages/student/AIAssistantPage";
import CourseDetailPage from "../pages/student/CourseDetailPage";
import CourseListPage from "../pages/student/CourseListPage";
import LessonTranscriptPage from "../pages/student/LessonTranscriptPage";
import LearningPage from "../pages/student/LearningPage";
import MyProgressPage from "../pages/student/MyProgressPage";
import ProfilePage from "../pages/student/ProfilePage";
import ProfileActivitiesPage from "../pages/profile/ProfileActivitiesPage";
import ProfileSettingsPage from "../pages/profile/ProfileSettingsPage";
import QuizPage from "../pages/student/QuizPage";
import QuizResultPage from "../pages/student/QuizResultPage";

// Admin
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import CourseManagementPage from "../pages/admin/CourseManagementPage";
import LessonManagementPage from "../pages/admin/LessonManagementPage";
import VideoUploadPage from "../pages/admin/VideoUploadPage";
import VideoManagementPage from "../pages/admin/VideoManagementPage";
import QuizManagementPage from "../pages/admin/QuizManagementPage";
import StudentManagementPage from "../pages/admin/StudentManagementPage";

// Other
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AboutPage from "../pages/static/AboutPage";
import ContactPage from "../pages/static/ContactPage";
import GuidePage from "../pages/static/GuidePage";
import PrivacyPage from "../pages/static/PrivacyPage";
import TermsPage from "../pages/static/TermsPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public + Student */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Public course pages */}
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />

        {/* Authenticated student pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/learning/:courseId/:lessonId" element={<LearningPage />} />
          <Route
            path="/learning/:courseId/:lessonId/transcript"
            element={<LessonTranscriptPage />}
          />
          <Route path="/quiz/:lessonId" element={<QuizPage />} />
          <Route path="/quiz/:lessonId/result" element={<QuizResultPage />} />
          <Route path="/my-progress" element={<MyProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/settings" element={<ProfileSettingsPage />} />
          <Route path="/profile/activities" element={<ProfileActivitiesPage />} />
        </Route>

        {/* Static */}
        <Route path="/about" element={<AboutPage />} />

        <Route path="/guide" element={<GuidePage />} />

        <Route path="/terms" element={<TermsPage />} />

        <Route path="/privacy" element={<PrivacyPage />} />

        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin routes: để riêng, KHÔNG nằm trong MainLayout */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/courses" element={<CourseManagementPage />} />
        <Route path="/admin/lessons" element={<LessonManagementPage />} />
        <Route path="/admin/upload" element={<VideoUploadPage />} />
        <Route path="/admin/videos" element={<VideoManagementPage />} />
        <Route path="/admin/quiz" element={<QuizManagementPage />} />
        <Route path="/admin/students" element={<StudentManagementPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
