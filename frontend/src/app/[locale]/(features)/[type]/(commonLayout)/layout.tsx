import Footer from "@/components/Global/Footer";
import Navbar from "@/components/Global/Navbar/Navbar";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-0">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
