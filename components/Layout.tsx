import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Nav />
      <main>{children}</main>
    </>
  );
}
