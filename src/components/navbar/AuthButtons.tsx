import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthButtonsProps {
  user: User | null;
}

const AuthButtons = ({ user }: AuthButtonsProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "Logged out",
      description: "You've logged out successfully",
    });
  };

  const handlePostJob = () => {
    navigate('/post-job');
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => navigate('/login')} title="Login to post new job listings">
      Login
    </Button>
  );
};

export default AuthButtons;