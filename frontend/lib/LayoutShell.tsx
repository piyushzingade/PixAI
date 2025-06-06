"use client";

import Footer from "@/components/landingComps/Footer";
import Topbar from "@/components/landingComps/Topbar";
import { usePathname } from "next/navigation";

import { ReactNode } from "react";

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideLayout =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/dashboard");

  return (
    <>
      {!hideLayout && <Topbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
