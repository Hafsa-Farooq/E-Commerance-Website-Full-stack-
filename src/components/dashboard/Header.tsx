'use client';

import React from "react";
import { PanelLeft, Search, Bell, Moon, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onToggle: () => void;
}

export default function Header({ onToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-16 bg-card/80 backdrop-blur-md border-b px-6 flex items-center justify-between gap-4">
      {/* Left: Sidebar Toggle & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button 
          onClick={onToggle}
          className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
        >
          <PanelLeft className="h-5 w-5" />
        </button>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-muted/40 border rounded-xl pl-10 pr-12 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono bg-muted border px-1.5 py-0.5 rounded text-muted-foreground">
            ⌘k
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="rounded-xl font-semibold text-xs bg-rose-500 text-white hover:bg-rose-600 border-none shadow-sm">
          Get Pro
        </Button>

        <button className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full" />
        </button>

        <button className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <Moon className="h-4 w-4" />
        </button>

        <button className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <Palette className="h-4 w-4" />
        </button>

        <div className="h-8 w-8 rounded-full overflow-hidden border ml-2">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="Profile" className="h-full w-full object-cover" />
        </div>
      </div>
    </header>
  );
}