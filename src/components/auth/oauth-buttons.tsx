"use client";

import { Button } from "@/components/ui/button";
import { ChromeIcon, FacebookIcon } from "lucide-react"; // Using Chrome as a placeholder for Google

export function OAuthButtons() {
  const handleGoogleLogin = () => {
    // Placeholder for Google login logic
    console.log("Attempting Google login...");
  };

  const handleFacebookLogin = () => {
    // Placeholder for Facebook login logic
    console.log("Attempting Facebook login...");
  };

  return (
    <div className="space-y-3">
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
