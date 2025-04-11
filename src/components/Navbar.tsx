import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Link, useNavigate } from "react-router-dom";
import BookmarksSheet from "./navbar/BookmarksSheet";
import AuthButtons from "./navbar/AuthButtons";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate('/my-jobs');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate('/my-jobs');
      }
    });

    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navigate]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-background border-b transition-all duration-300 ${
      scrolled ? 'py-2 shadow-md' : 'py-4'
    }`}>
      <div className="container mx-auto px-2 sm:px-4 flex justify-between items-center">
        <Link to="/" className={`font-bold transition-all duration-300 ${
          scrolled ? 'text-sm' : 'text-base'
        }`}>
          <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" width="100" height="60">
            <defs>
              <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#f9f9f9" stopOpacity="1" />
              </linearGradient>
            </defs>
            <rect width="500" height="300" fill="url(#backgroundGradient)" />
            <text x="250" y="130" fontFamily="'Twentieth Century', 'Avant Garde', 'ITC Avant Garde Gothic', 'Century Gothic', 'Futura', sans-serif" fontWeight="600" fontSize="52" textAnchor="middle" fill="#333333" letterSpacing="3">WAKE UP</text>
            <text x="250" y="200" fontFamily="'Twentieth Century', 'Avant Garde', 'ITC Avant Garde Gothic', 'Century Gothic', 'Futura', sans-serif" fontWeight="600" fontSize="72" textAnchor="middle" fill="#333333" letterSpacing="4">HAPPY</text>
            <line x1="150" y1="220" x2="350" y2="220" stroke="#333333" strokeWidth="1" opacity="0.5" />
          </svg>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <Link to="/my-jobs" className="text-sm font-medium hover:text-primary whitespace-nowrap">
              My Jobs
            </Link>
          )}
          <BookmarksSheet />
          <AuthButtons user={user} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;