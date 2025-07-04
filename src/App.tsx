import { Outlet } from "react-router-dom";
import { useState } from "react";
import CookieConsent from "react-cookie-consent";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from '@/components/Analytics';

function App() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Analytics enable={analyticsEnabled} />
      <Navbar />
      <main className="pt-24 flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        style={{ background: "#2B373B", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        buttonStyle={{ color: "#fff", background: "#4f46e5", fontSize: "13px", borderRadius: "6px", order: 0, marginRight: "16px" }}
        contentStyle={{ display: "flex", alignItems: "center", flex: 1, order: 1 }}
        containerClasses="cookie-banner-flex"
        expires={150}
        onAccept={() => setAnalyticsEnabled(true)}
        buttonWrapperClasses="cookie-banner-button-left"
      >
        <span style={{ flex: 1 }}>
          This website uses cookies to enhance the user experience.{' '}
          <a href="https://seo-vacancy.eu/privacy-policy" style={{ color: "#a5b4fc", textDecoration: "underline" }}>Learn more</a>.
        </span>
      </CookieConsent>
    </div>
  );
}

export default App;