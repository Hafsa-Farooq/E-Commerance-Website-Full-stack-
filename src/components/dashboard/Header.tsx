import { Search, Bell, Moon, Palette, PanelLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onToggle: () => void;
}

export default function Header({ onToggle }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6 sticky top-0 z-40">
      {/* Left side: Collapse Icon & Search Bar */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle} 
          className="h-9 w-9 text-muted-foreground shrink-0 rounded-xl hover:bg-muted"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        
        <div className="w-64 sm:w-80 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-xl bg-muted/40 pl-9 pr-12 text-sm"
          />
          <div className="absolute right-3 top-2 flex items-center gap-0.5 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            <span>⌘</span>k
          </div>
        </div>
      </div>

      {/* Right side Actions & Profile */}
      <div className="flex items-center gap-3">
        <button className="text-sm font-bold text-rose-500 hover:opacity-80 px-2 hidden sm:block">
          Get Pro
        </button>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500"></span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
          <Moon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
          <Palette className="h-4 w-4" />
        </Button>
        <div className="h-9 w-9 rounded-full bg-slate-300 overflow-hidden ml-2">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
            alt="Avatar" 
            className="h-full w-full object-cover" 
          />
        </div>
      </div>
    </header>
  );
}