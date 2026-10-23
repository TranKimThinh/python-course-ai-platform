import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

const HomePage = lazy(() => import("../pages/HomePage"));

// Auth
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));

// Student
const AIAssistantPage = lazy(() => import("../pages/student/AIAssistantPage"));
const CourseDetailPage = lazy(() => import("../pages/student/CourseDetailPage"));
const CourseListPage = lazy(() => import("../pages/student/CourseListPage"));
const LessonTranscriptPage = lazy(() => import("../pages/student/LessonTranscriptPage"));
const LearningPage = lazy(() => import("../pages/student/LearningPage"));
const MyProgressPage = lazy(() => import("../pages/student/MyProgressPage"));
const ProfilePage = lazy(() => import("../pages/student/ProfilePage"));
const ProfileActivitiesPage = lazy(() => import("../pages/profile/ProfileActivitiesPage"));
const ProfileSettingsPage = lazy(() => import("../pages/profile/ProfileSettingsPage"));
const QuizPage = lazy(() => import("../pages/student/QuizPage"));
const QuizResultPage = lazy(() => import("../pages/student/QuizResultPage"));

// Admin
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage"));
const CourseManagementPage = lazy(() => import("../pages/admin/CourseManagementPage"));
const LessonManagementPage = lazy(() => import("../pages/admin/LessonManagementPage"));
const VideoUploadPage = lazy(() => import("../pages/admin/VideoUploadPage"));
const VideoManagementPage = lazy(() => import("../pages/admin/VideoManagementPage"));
const QuizManagementPage = lazy(() => import("../pages/admin/QuizManagementPage"));
const StudentManagementPage = lazy(() => import("../pages/admin/StudentManagementPage"));

// Other
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
const AboutPage = lazy(() => import("../pages/static/AboutPage"));
const ContactPage = lazy(() => import("../pages/static/ContactPage"));
const GuidePage = lazy(() => import("../pages/static/GuidePage"));
const PrivacyPage = lazy(() => import("../pages/static/PrivacyPage"));
const TermsPage = lazy(() => import("../pages/static/TermsPage"));

function AppRoutes() {
  return (
    <Suspense fallback={<div role="status" className="p-8 text-center">Loading...</div>}>
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

      <Route path="*" element={<div className="p-12 text-center"><h1>Không tìm thấy trang</h1><a href="/">Về trang chủ</a></div>} />
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
    </Suspense>
  );
}

export default AppRoutes;
