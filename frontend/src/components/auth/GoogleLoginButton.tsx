import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { parseApiError } from "../../services/authService";

// Khai báo kiểu dữ liệu tối thiểu cho Google Identity Services (window.google)
interface GoogleCredentialResponse {
  credential: string; // đây chính là id_token
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

function GoogleLoginButton() {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("Thiếu VITE_GOOGLE_CLIENT_ID trong file .env");
      return;
    }

    function renderGoogleButton() {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: GoogleCredentialResponse) => {
          try {
            const authUser = await loginWithGoogle(response.credential);
            navigate(authUser.role === "admin" ? "/admin" : "/courses", { replace: true });
          } catch (error) {
            console.error("Đăng nhập Google thất bại:", parseApiError(error));
            alert(parseApiError(error));
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
      });
    }

    // Script Google Identity có thể load chưa xong lúc component mount, nên chờ tới khi sẵn sàng
    if (window.google) {
      renderGoogleButton();
    } else {
      const scriptCheckInterval = setInterval(() => {
        if (window.google) {
          clearInterval(scriptCheckInterval);
          renderGoogleButton();
        }
      }, 200);
      return () => clearInterval(scriptCheckInterval);
    }
  }, [loginWithGoogle, navigate]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center text-xs text-amber-700">
        Chưa cấu hình VITE_GOOGLE_CLIENT_ID trong file .env
      </p>
    );
  }

  return <div ref={buttonRef} className="flex w-full justify-center" />;
}

export default GoogleLoginButton;