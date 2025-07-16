// src/app/layout.tsx
import "./globals.css";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
