
import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="mb-6">
          <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-primary to-energy flex items-center justify-center mx-auto">
            <span className="font-bold text-4xl text-white">L</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">Oops! Page not found</p>
        <p className="text-muted-foreground max-w-md">
          We couldn't find the page at <span className="font-mono text-sm bg-accent/10 px-2 py-0.5 rounded">{location.pathname}</span>
        </p>
        <Button asChild className="gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
