//src/app/(auth)/login/page.tsx
import { LoginForm } from "@/features/auth/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In — Cinevault",
  description:
    "Securely log in to your Cinevault account to access and manage your movie and series vault.",
};

export default function LoginPage() {
  return <LoginForm />;
}
