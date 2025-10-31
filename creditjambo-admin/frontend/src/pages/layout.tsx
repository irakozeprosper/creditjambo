import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "../utils/cn";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { useClickOutside } from "../hooks/use-click-outside";

const Layout = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(!isDesktop);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => setCollapsed(!isDesktop), [isDesktop]);

  useClickOutside([sidebarRef], () => {
    if (!isDesktop && !collapsed) setCollapsed(true);
  });

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950">
      {/* Overlay for mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black opacity-0 pointer-events-none z-20 transition-opacity duration-300",
          !collapsed && "opacity-30"
        )}
      />

      <Sidebar ref={sidebarRef} collapsed={collapsed} />

      {/* Main content */}
      <div
        className={cn(
          "flex-1 transition-[margin] duration-300",
          collapsed ? "md:ml-[70px]" : "md:ml-60"
        )}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="h-[calc(100vh-60px)] overflow-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
