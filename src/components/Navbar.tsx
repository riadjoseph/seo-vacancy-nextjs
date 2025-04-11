import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Link, useNavigate } from "react-router-dom";
import BookmarksSheet from "./navbar/BookmarksSheet";
import AuthButtons from "./navbar/AuthButtons";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-background border-b transition-all duration-300 ${
      scrolled ? 'py-2 shadow-md' : 'py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className={`font-bold transition-all duration-300 ${
          scrolled ? 'text-sm' : 'text-base'
        }`}>SEO Job Board</Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {user && (
            <Link to="/my-jobs" className="text-sm font-medium hover:text-primary">
              My Jobs
            </Link>
          )}
          <BookmarksSheet />
          <AuthButtons user={user} />
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 shadow-lg border-t bg-background">
          <div className="flex flex-col space-y-3">
            {user && (
              <Link 
                to="/my-jobs" 
                className="text-sm font-medium hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Jobs
              </Link>
            )}
            <div onClick={() => setMobileMenuOpen(false)}>
              <BookmarksSheet />
            </div>
            <div onClick={() => setMobileMenuOpen(false)}>
              <AuthButtons user={user} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;