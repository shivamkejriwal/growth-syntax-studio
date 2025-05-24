'use client';

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar';
import { SidebarContent } from './sidebar-content';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import { Input } from '../ui/input';

export function AppShell({ children }: { children: React.ReactNode }) {
  // Get initial sidebar state from cookies or default to true
  const [initialSidebarOpen, setInitialSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('sidebar_state='))
        ?.split('=')[1];
      setInitialSidebarOpen(cookieValue ? cookieValue === 'true' : true);
    }
  }, []);


  return (
    <SidebarProvider defaultOpen={initialSidebarOpen}>
      <Sidebar variant="sidebar" collapsible="icon" side="left">
        <SidebarContent />
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            {/* User profile dropdown can be added here */}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
