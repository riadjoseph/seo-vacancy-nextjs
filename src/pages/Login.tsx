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
        <h1 className="text-2xl font-bold mb-6">Login with Google or LinkedIn</h1>
        <p className="text-l mb-3">Login to add or remove Job Listings</p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'linkedin_oidc']} // Enable Google & linkedin login
          view="magic_link" // Show magic link by default
          redirectTo={`${window.location.origin}/my-jobs`}
        />
        {/* <div className="mt-4 space-y-2 text-sm text-gray-600"> */}
        {/* <p> */}
        {/*     Want to use password?{" "} */}
        {/*     <a href="/login-password" className="text-primary hover:underline"> */}
        {/*       Login here */}
        {/*     </a> */}
        {/*   </p> */}
        {/* </div> */}
      </Card>
    </div>
  );
};

export default Login;