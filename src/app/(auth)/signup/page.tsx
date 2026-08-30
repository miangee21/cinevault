//src/app/(auth)/signup/page.tsx
import { SignupForm } from "@/features/auth/components/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — Cinevault",
  description:
    "Create your Cinevault account and start organizing, tracking, and managing your movies and series.",
};

export default function SignupPage() {
  return <SignupForm />;
}
