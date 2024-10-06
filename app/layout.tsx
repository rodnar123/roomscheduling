import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { SyntheticModule } from "vm";
import SyncUser from "@/components/SyncUser ";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PNGUNITECH",
  description: "PNGUNITECH PORTAL",
  icons: {
    icon: "/icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#ffffff", // Change primary color to a modern blue
          colorText: "#ffffff", // Dark text color
          borderRadius: "0.75rem", // Modern rounded corners
          spacingUnit: "1.1rem", // Increase spacing for more modern feel
          fontFamily: "Poppins, sans-serif", // Use a sleek font
          colorBackground: "#0f172a", // Light background
        },
        elements: {
          card: "bg-slate-900", // Add box shadow to cards
          headerTitle: "text-3xl font-semibold", // Style the modal header
          headerSubtitle: "text-sm text-gray-500", // Style the subtitle
          modal: "bg-blue-500", // Style the modal
          primaryButton: "bg-blue-500 hover:bg-blue-600 text-white", // Style primary buttons
          formFieldInput: "border-gray-300 focus:ring-blue-500", // Style input fields
          socialButtonsBlockButtonText: "text-white", // Style social buttons
          socialButtonsIconButton__google: "bg-red-500", // Style social buttons
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUser />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
