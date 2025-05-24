import Link from 'next/link';
import { Briefcase } from 'lucide-react'; // Using Briefcase as a placeholder for a finance/growth related icon

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center space-x-2 text-2xl font-bold text-foreground ${className}`}>
      <Briefcase className="h-8 w-8" />
      <span>GrowthSyntax</span>
    </Link>
  );
}
