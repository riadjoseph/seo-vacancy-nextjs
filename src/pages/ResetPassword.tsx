import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ResetPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/my-jobs");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="container max-w-md py-8">
      <Card className="p-8">
        <h1 className="text-2xl font-bold mb-6">Reset Your Password</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          view="forgotten_password"
          showLinks={false}
          redirectTo={`${window.location.origin}/login`}
        />
        <p className="mt-4 text-sm text-gray-600">
          Remember your password? <a href="/login" className="text-primary hover:underline">Login here</a>
        </p>
      </Card>
    </div>
  );
};

export default ResetPassword;
