import { Outlet } from "react-router-dom";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}

export default MainLayout;
