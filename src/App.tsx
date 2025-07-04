import { Outlet } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
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
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#fff", background: "#4f46e5", fontSize: "13px", borderRadius: "6px" }}
        expires={150}
      >
        This website uses cookies to enhance the user experience.{' '}
        <a href="/PrivacyPolicy" style={{ color: "#a5b4fc", textDecoration: "underline" }}>Learn more</a>.
      </CookieConsent>
    </div>
  );
}

export default App;