
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Index";
import Scenarios from "./pages/Scenarios";
import Chat from "./pages/Chat";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { UserProgressProvider } from "./context/UserProgressContext";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProgressProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="scenarios" element={<Scenarios />} />
              <Route path="chat/:scenarioId" element={<Chat />} />
              <Route path="about" element={<About />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProgressProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
