"use client";

import { AppStoreButton } from "@/components/ui/AppStoreButton";
import { PlayStoreButton } from "@/components/ui/PlayStoreButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const MobileAppSignupLanding = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src="/Tese-Icon.png" alt="Tese Icon" className="mx-auto mb-4 w-16 h-16" />
          <CardTitle className="text-2xl font-bold">
            Sign up using our mobile app
          </CardTitle>
          <CardDescription className="text-base">
            New accounts can only be created in our mobile app. Download it below to get started.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Store Buttons */}
          <div className="space-y-3">
            <AppStoreButton 
              size="lg" 
              className="w-full" 
              url="#" 
            />
            <PlayStoreButton 
              size="lg" 
              className="w-full" 
              url="#" 
            />
          </div>
          
          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Why use our mobile app?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Enhanced security features</li>
              <li>• Push notifications for payments</li>
              <li>• Quick and easy account setup</li>
              <li>• Optimized for mobile payments</li>
            </ul>
          </div>
          
          {/* Back to Login */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Already have an account? You can continue using the web app to login and manage your account.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t">
            <p>© 2025 Tese. All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileAppSignupLanding;