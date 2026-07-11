import { Braces } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import AuthIllustration from "../../components/auth/AuthIllustration";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return null; // chờ AuthContext xác nhận xong token, tránh nháy UI

  if (isAuthenticated) {
    const redirectTo = user?.role === "admin" ? "/admin" : "/courses";
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return (
    <main className="flex min-h-screen bg-slate-50">
      <AuthIllustration />

      <section className="relative flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-8 md:w-[44%] md:bg-white lg:px-10 xl:px-16">
        <div className="absolute right-8 top-8 hidden h-32 w-32 rounded-full bg-indigo-100/60 blur-3xl sm:block lg:hidden" />

        <div className="relative w-full max-w-lg rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-card sm:p-9 lg:max-w-md lg:border-0 lg:p-0 lg:shadow-none">
          <Link
            to="/"
            className="focus-ring mb-8 flex w-fit items-center gap-2.5 rounded-xl md:hidden"
            aria-label="Về trang chủ Python AI Learning"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-200">
              <Braces size={21} strokeWidth={2.5} />
            </span>
            <span className="text-base font-extrabold tracking-tight text-slate-950">
              Python <span className="text-indigo-600">AI</span> Learning
            </span>
          </Link>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
