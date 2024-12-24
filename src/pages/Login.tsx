import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Login = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User is already logged in. Redirecting to /my-jobs...");
        navigate("/my-jobs");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="container max-w-md py-8">
      <Card className="p-8">
        <h1 className="text-2xl font-bold mb-6">Login to Access Your Jobs</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]} // Add OAuth providers here if required
        />
      </Card>
    </div>
  );
};

export default Login;