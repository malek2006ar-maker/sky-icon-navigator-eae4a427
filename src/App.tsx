import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Sliders from "./pages/admin/Sliders";
import Services from "./pages/admin/Services";
import Packages from "./pages/admin/Packages";
import Announcements from "./pages/admin/Announcements";
import Gallery from "./pages/admin/Gallery";
import Testimonials from "./pages/admin/Testimonials";
import Stats from "./pages/admin/Stats";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="sliders" element={<Sliders />} />
              <Route path="services" element={<Services />} />
              <Route path="packages" element={<Packages />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="stats" element={<Stats />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
