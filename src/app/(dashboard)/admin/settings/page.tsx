//src/app/(dashboard)/admin/settings/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { UserPlus, Loader2, ShieldCheck } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import { api } from "@convex/_generated/api";
import { useIsAdmin } from "@/features/auth/hooks/useIsAdmin";
import { useSignupEnabled } from "@/features/auth/hooks/useSignupEnabled";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { signupEnabled, isLoading: isSettingLoading } = useSignupEnabled();
  const setSignupEnabled = useMutation(api.appSettings.setSignupEnabled);

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdminLoading, isAdmin, router]);

  const handleToggle = async (checked: boolean) => {
    try {
      await setSignupEnabled({ enabled: checked });
      toast.success(checked ? "Signups enabled" : "Signups disabled");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't update setting",
      );
    }
  };

  if (isAdminLoading || !isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.12)] text-primary">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Admin Settings
          </h1>
          <p className="text-sm text-muted-foreground">Only visible to you.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UserPlus className="size-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Allow new signups
              </p>
              <p className="text-xs text-muted-foreground">
                When off, the signup page still shows normally but no account
                can be created.
              </p>
            </div>
          </div>
          <Switch
            checked={signupEnabled}
            disabled={isSettingLoading}
            onCheckedChange={handleToggle}
          />
        </div>
      </div>
    </div>
  );
}
