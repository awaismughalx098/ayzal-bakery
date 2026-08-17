import { createContext } from "react";

/* ============================================
   The context objects live here on their own.
   The provider files (AuthContext.jsx /
   CartContext.jsx) then export only components,
   which keeps Vite fast refresh working and stops
   state resetting on every edit.
   ============================================ */

export const AuthContext = createContext();

export const CartContext = createContext();
