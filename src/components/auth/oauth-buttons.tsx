
"use client";

import { Button } from "@/components/ui/button";
import { ChromeIcon, FacebookIcon } from "lucide-react"; // Using Chrome as a placeholder for Google
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, AuthError } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function OAuthButtons() {
  const router = useRouter();
  const { toast } = useToast();

  const handleOAuthLogin = async (provider: GoogleAuthProvider | FacebookAuthProvider, providerName: string) => {
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: `${providerName} Login Successful`,
        description: `Welcome! Redirecting to dashboard...`,
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error(`${providerName} login error:`, error);
      let errorMessage = `Failed to login with ${providerName}. Please try again.`;
      if (error.code === "auth/account-exists-with-different-credential") {
        errorMessage = `An account already exists with the same email address but different sign-in credentials. Try signing in using a different method linked to this email.`;
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = `Login process was cancelled. The ${providerName} sign-in popup was closed.`;
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = `Login process was cancelled. Only one ${providerName} sign-in popup can be open at a time.`;
      }
      toast({
        title: `${providerName} Login Failed`,
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    handleOAuthLogin(provider, "Google");
  };

  const handleFacebookLogin = () => {
    const provider = new FacebookAuthProvider();
    // Note: Facebook login requires more setup on Facebook for Developers portal (App ID, App Secret)
    // and enabling it in Firebase console.
    handleOAuthLogin(provider, "Facebook");
  };

  return (
    <div className="space-y-3">
      {/* 
        Ensure you have configured Google & Facebook as sign-in methods in your Firebase project console.
        For Facebook, you also need to set up an app on the Facebook for Developers portal.
      */}
      <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
        <ChromeIcon className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
      <Button variant="outline" className="w-full" onClick={handleFacebookLogin}>
        <FacebookIcon className="mr-2 h-4 w-4" />
        Continue with Facebook
      </Button>
    </div>
  );
}
