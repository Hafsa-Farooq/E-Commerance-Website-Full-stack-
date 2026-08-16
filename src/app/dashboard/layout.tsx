'use client';

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen w-full bg-muted/15 flex">
      {/* Sidebar Component - Har page par fix rahega */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? "md:pl-72" : "md:pl-20"}`}>
        <Header onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}