import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Features from "./pages/Features";
import UserRoles from "./pages/UserRoles";
import HowItWorks from "./pages/HowItWorks";
import AIAdvantage from "./pages/AIAdvantage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PurchaseAdmin from "./pages/PurchaseAdmin";
import AdminSetup from "./pages/AdminSetup";
import DevAdminSetup from "./components/DevAdminSetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
          <Routes>
            {/* Public routes with navbar */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
              </>
            } />
            <Route path="/features" element={
              <>
                <Navbar />
                <Features />
              </>
            } />
            <Route path="/user-roles" element={
              <>
                <Navbar />
                <UserRoles />
              </>
            } />
            <Route path="/how-it-works" element={
              <>
                <Navbar />
                <HowItWorks />
              </>
            } />
            <Route path="/ai-advantage" element={
              <>
                <Navbar />
                <AIAdvantage />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navbar />
                <About />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <Contact />
              </>
            } />
            {/* Auth routes without navbar */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/purchase-admin" element={<PurchaseAdmin />} />
            <Route path="/admin-setup" element={<AdminSetup />} />
            <Route path="/dev-admin" element={<DevAdminSetup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
