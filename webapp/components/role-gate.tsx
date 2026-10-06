"use client";

import { useRole } from "@/components/role-provider";
import { Rol } from "@/lib/types";

export function RoleGate({
  rolRequerido,
  children,
  fallback = null,
}: {
  rolRequerido: Rol;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { rol } = useRole();

  if (rol !== rolRequerido) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
