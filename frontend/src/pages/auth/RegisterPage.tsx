import { Navigate } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";
import RegisterIllustration from "../../components/auth/RegisterIllustration";
import { useAuth } from "../../context/AuthContext";

function RegisterPage() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/courses"} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="page-container grid items-start gap-8 py-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-10 lg:py-12 xl:gap-14">
        <RegisterIllustration />
        <section className="order-1 w-full lg:order-2" aria-label="Biểu mẫu đăng ký">
          <RegisterForm />
        </section>
      </main>
    </div>
  );
}

export default RegisterPage;
