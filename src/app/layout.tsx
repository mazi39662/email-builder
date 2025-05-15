import "./globals.css";
import type { Metadata } from "next";
import AuthenticatedLayout from "../components/AuthenticatedLayout";

export const metadata: Metadata = {
  title: "Email Builder",
  description: "Drag-and-drop email template builder for marketers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </body>
    </html>
  );
}
