//src/shared/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clapperboard,
  LayoutDashboard,
  FolderTree,
  LogOut,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { ThemeToggle } from "@/features/theme/components/ThemeToggle";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { cn } from "@/shared/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/categories", label: "Categories", icon: FolderTree },
];

function getInitial(name?: string) {
  return name?.trim().charAt(0).toUpperCase() ?? "";
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuthActions();
  const { user, isLoading } = useCurrentUser();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <header className="grid h-14 grid-cols-[1fr_auto_1fr] items-center border-b border-[hsl(var(--border))] bg-background px-6">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Clapperboard className="size-5 text-[hsl(var(--primary))]" />
        <span className="font-display text-base font-semibold text-foreground">
          Cinevault
        </span>
      </Link>

      <nav className="flex items-center gap-1 justify-self-center">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <link.icon className="size-3.5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-end gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-[hsl(var(--foreground)/0.06)]"
              >
                <Avatar className="size-8 ring-2 ring-transparent transition-all">
                  <AvatarFallback className="bg-linear-to-br from-[hsl(var(--primary)/0.25)] to-[hsl(var(--primary)/0.1)] text-sm font-semibold text-[hsl(var(--primary))]">
                    {isLoading ? "" : getInitial(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
            }
          />
          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-64 rounded-2xl p-0"
          >
            <div className="flex items-center gap-3 p-4">
              <Avatar className="size-11">
                <AvatarFallback className="bg-linear-to-br from-[hsl(var(--primary)/0.3)] to-[hsl(var(--primary)/0.12)] text-base font-semibold text-[hsl(var(--primary))]">
                  {isLoading ? "" : getInitial(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-foreground">
                  {isLoading ? "..." : user?.name || "Unnamed"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>

            <div className="h-px bg-[hsl(var(--border))]" />

            <div className="p-2">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[hsl(var(--destructive))] transition-colors hover:bg-[hsl(var(--destructive)/0.1)]"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
