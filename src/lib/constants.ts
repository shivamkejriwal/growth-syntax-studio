import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, TrendingUp, PieChart, Brain, Star, UserCircle, LogOut } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/equity-analysis', label: 'Equity Analysis', icon: TrendingUp },
  { href: '/market-overview', label: 'Market Overview', icon: PieChart },
  { href: '/swot-analysis', label: 'SWOT Analysis', icon: Brain },
  { href: '/watchlist', label: 'Watchlist', icon: Star },
];

export const USER_NAV_ITEMS: NavItem[] = [
    { href: '/profile', label: 'Profile', icon: UserCircle }, // Placeholder
    { href: '/logout', label: 'Logout', icon: LogOut }, // Placeholder
]
