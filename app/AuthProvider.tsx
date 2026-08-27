"use client"

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { PropsWithChildren } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  return <KindeProvider>{children}</KindeProvider>;
}
