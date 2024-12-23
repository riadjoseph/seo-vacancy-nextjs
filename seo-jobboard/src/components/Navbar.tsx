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
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className={`font-bold transition-all duration-300 ${
          scrolled ? 'text-sm' : 'text-base'
        }`}>SEO Job Board</Link>
        <div className="flex items-center gap-4">
          {user && (
            <Link to="/my-jobs" className="text-sm font-medium hover:text-primary">
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