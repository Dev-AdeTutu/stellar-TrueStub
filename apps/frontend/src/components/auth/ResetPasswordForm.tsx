"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface ResetPasswordFormProps {
  onSubmit: (password: string, confirmPassword: string) => Promise<void>;
  isValidToken: boolean;
}

export default function ResetPasswordForm({
  onSubmit,
  isValidToken,
}: ResetPasswordFormProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage(t("auth.passwordsDoNotMatch"));
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage(t("auth.passwordMinLength"));
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await onSubmit(password, confirmPassword);
      setStatus("success");
      setMessage(t("auth.passwordResetSuccess"));
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : t("auth.failedResetPassword"),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2 text-left">
        <Label htmlFor="new-password">{t("auth.newPassword")}</Label>
        <Input
          id="new-password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="confirm-password">{t("auth.confirmPassword")}</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>

      {message && (
        <Alert variant={status === "error" ? "destructive" : "default"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full bg-[#2857B8] hover:bg-[#2857B8]/90"
        disabled={status === "loading" || !isValidToken}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("auth.resetting")}
          </>
        ) : (
          t("auth.resetPasswordButton")
        )}
      </Button>

      <div className="text-sm">
        <Link href="/login" className="text-[#2857B8] hover:underline">
          {t("auth.backToLogin")}
        </Link>
      </div>
    </form>
  );
}
