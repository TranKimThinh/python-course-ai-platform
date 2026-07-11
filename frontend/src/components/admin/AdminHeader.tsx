import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAdminNavigation } from "./AdminLayout";

interface AdminHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: string;
}

function AdminHeader({ title, actionLabel, onAction, actionIcon = "add" }: AdminHeaderProps) {
  const [hasNotification] = useState(true);
  const { user } = useAuth();
  const { openSidebar } = useAdminNavigation();

  
}

export default AdminHeader;
