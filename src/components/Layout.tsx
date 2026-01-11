import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Outlet />
      </main>
      
      {/* Subtle scan lines effect */}
      <div className="scan-lines pointer-events-none" />
    </div>
  );
};
