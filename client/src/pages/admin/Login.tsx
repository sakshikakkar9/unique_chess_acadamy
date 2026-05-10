import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, AlertCircle, Loader2 } from "lucide-react";

// IMPORTANT: We are importing your CUSTOM instance defined above
import axios from "@/lib/axios"; 

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(""); 

    try {
      // This call now automatically uses the BaseURL from your axios.ts file
      const response = await axios.post("/api/admin/login", {
        username,
        password,
      });

      // Saving the token to your Auth context
      login(response.data.token); 

      navigate(from, { replace: true });
    } catch (err: any) {
      // Extracting the specific error message from your Express backend
      const message = err.response?.data?.message || err.response?.data?.error || "Invalid credentials. Please try again.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-uca-bg-base lg:bg-[url('/bg-pattern.svg')] lg:bg-repeat p-0 sm:p-4">
      <Card className="w-full max-w-none sm:max-w-md mx-4 sm:mx-0 bg-uca-bg-surface border-uca-border shadow-2xl">
        <CardHeader className="space-y-1 text-center pt-8 sm:pt-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-uca-navy flex items-center justify-center border border-uca-border">
              <Trophy className="text-uca-accent-blue h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-uca-text-primary">Admin Login</CardTitle>
          <CardDescription className="text-uca-text-muted">Enter your credentials to access the command center</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6 sm:px-8">
            {errorMsg && (
              <div className="bg-uca-accent-red/10 border border-uca-accent-red/20 text-uca-accent-red text-sm p-3 rounded-lg flex items-center gap-2">
                <span className="flex-shrink-0"><AlertCircle className="h-4 w-4" /></span>
                <p>{errorMsg}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-semibold text-uca-text-muted uppercase tracking-wide">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11 bg-uca-bg-elevated border-uca-border text-uca-text-primary placeholder:text-slate-400 focus:ring-2 focus:ring-uca-navy/30 focus:border-uca-navy outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-uca-text-muted uppercase tracking-wide">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-uca-bg-elevated border-uca-border text-uca-text-primary placeholder:text-slate-400 focus:ring-2 focus:ring-uca-navy/30 focus:border-uca-navy outline-none"
              />
            </div>
          </CardContent>
          <CardFooter className="pb-8 sm:pb-6 px-6 sm:px-8">
            <Button
              className="w-full bg-uca-navy hover:bg-uca-navy-hover text-white font-bold h-11 rounded-xl transition-all gap-2 disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login to Dashboard"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;