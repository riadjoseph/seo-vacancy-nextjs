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

  // Inject LinkedIn icon after Supabase’s Auth buttons are rendered
  useEffect(() => {
    // Slight delay to ensure the DOM is updated
    const timeout = setTimeout(() => {
      // Look for the LinkedIn button by its data attribute
      const linkedInButton = document.querySelector('button[data-provider="linkedin_oidc"]');
      if (linkedInButton) {
        // Remove any default icon if present
        const existingIcon = linkedInButton.querySelector("svg");
        if (existingIcon) existingIcon.remove();

        // Insert a new icon
        const newIcon = document.createElement("span");
        newIcon.innerHTML = `
          <svg
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            width="21px"
            height="21px"
            viewBox="0 0 24 24"
          >
            <title>LinkedIn</title>
            <path fill="#0077B5"
              d="M20.451 20.451h-3.75v-5.539c0-1.322-.472-2.224-1.657-2.224
                 -0.904 0-1.443.604-1.681 1.188-0.086.213-0.108.509-0.108.805v5.77h-3.75
                 s0.049-9.367 0-10.344h3.75v1.465c-.007.011-.017.023-.024.034h.024v-0.034
                 c0.498-.767 1.38-1.859 3.358-1.859 2.452 0 4.292 1.604 4.292 5.058v5.68zM5.337 7.433
                 c-1.279 0-2.125-.84-2.125-1.885 0-1.071.86-1.886 2.164-1.886 1.304 0 2.125.815
                 2.125 1.886-0.024 1.046-.82 1.885-2.164 1.885zM3.457 20.451h3.75v-10.34h-3.75v10.34z
                 M22.225 0H1.771C.79 0 0 .77 0 1.728v20.543C0 23.228.79 24 1.771 24h20.451
                 C23.21 24 24 23.228 24 22.271V1.728C24 .77 23.21 0 22.225 0z"/>
          </svg>
        `;
        linkedInButton.prepend(newIcon);

        // Replace the text "Sign in with Linkedin_oidc" with something nicer
        const buttonTextNode = [...linkedInButton.childNodes].find(
          (node) => node.nodeType === Node.TEXT_NODE
        );
        if (buttonTextNode) {
          buttonTextNode.nodeValue = "Sign in with LinkedIn";
        }
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="container max-w-md py-8">
      <Card className="p-8">
        <h1 className="text-2xl font-bold mb-6">Login with Google or LinkedIn</h1>
        <p className="text-l mb-3">Login to add or remove Job Listings</p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google", "linkedin_oidc"]} // enable Google & LinkedIn
          view="magic_link" 
          redirectTo={`${window.location.origin}/my-jobs`}
        />
      </Card>
    </div>
  );
};

export default Login;