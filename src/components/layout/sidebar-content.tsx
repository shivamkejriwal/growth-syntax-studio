'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { NAV_ITEMS, USER_NAV_ITEMS } from '@/lib/constants';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      
      <SidebarMenu className="flex-1 px-2 py-0">
        {NAV_ITEMS.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.match && item.match(pathname))}
                tooltip={item.label}
              >
                <a>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarSeparator />

      <SidebarFooter className="p-2">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
            <AvatarFallback>GS</AvatarFallback>
          </Avatar>
          <div className="flex-1 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-sidebar-foreground">User Name</p>
            <p className="text-xs text-sidebar-foreground/70">user@example.com</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 group-data-[collapsible=icon]:hidden ml-auto" asChild>
            <Link href="/login"> {/* Placeholder for logout */}
              <LogOut />
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </>
  );
}
