import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from '@/components/Analytics';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Analytics />
      <Navbar />
      <main className="pt-24 flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;