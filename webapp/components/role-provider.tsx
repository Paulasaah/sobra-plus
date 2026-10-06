"use client";

// Selector de rol sin autenticacion real (ver docs/PLAN_IMPLEMENTACION.md:
// "Autenticacion real de usuarios - se simula con un selector simple de rol").
// Se persiste en localStorage solo para que la demo no pierda el rol al
// navegar entre paginas; no es un mecanismo de seguridad.

import * as React from "react";
import { Rol } from "@/lib/types";

const STORAGE_KEY = "sobra-plus-rol";
const ROL_POR_DEFECTO: Rol = "establecimiento";

type RoleContextValue = {
  rol: Rol;
  setRol: (rol: Rol) => void;
};

const RoleContext = React.createContext<RoleContextValue | undefined>(
  undefined
);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [rol, setRolState] = React.useState<Rol>(ROL_POR_DEFECTO);

  React.useEffect(() => {
    const guardado = window.localStorage.getItem(STORAGE_KEY);
    if (guardado === "establecimiento" || guardado === "punto-receptor") {
      setRolState(guardado);
    }
  }, []);

  const setRol = React.useCallback((nuevoRol: Rol) => {
    setRolState(nuevoRol);
    window.localStorage.setItem(STORAGE_KEY, nuevoRol);
  }, []);

  return (
    <RoleContext.Provider value={{ rol, setRol }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const context = React.useContext(RoleContext);
  if (!context) {
    throw new Error("useRole debe usarse dentro de RoleProvider.");
  }
  return context;
}
