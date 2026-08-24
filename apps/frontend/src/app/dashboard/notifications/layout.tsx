import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | TrueStub",
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
