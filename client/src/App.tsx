import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Public pages
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Schools from "./pages/Schools";
import Calculator from "./pages/Calculator";
import GuidesIndex from "./pages/GuidesIndex";

// Guide pages
import HowToBecomePilot from "./pages/guides/HowToBecomePilot";
import PilotTrainingCosts from "./pages/guides/PilotTrainingCosts";
import IntegratedVsModular from "./pages/guides/IntegratedVsModular";
import Class1Medical from "./pages/guides/Class1Medical";
import AirlinePilotSalary from "./pages/guides/AirlinePilotSalary";
import BestRouteToAirline from "./pages/guides/BestRouteToAirline";
import FinanceGuide from "./pages/guides/FinanceGuide";
import TrainingTimeline from "./pages/guides/TrainingTimeline";

// Admin
import AdminDashboard from "./pages/AdminDashboard";

// Simple static pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

function Router() {
  return (
    <Switch>
      {/* Home */}
      <Route path="/" component={Home} />

      {/* Quiz funnel */}
      <Route path="/quiz" component={Quiz} />
      <Route path="/results/:leadId" component={Results} />

      {/* Directory & tools */}
      <Route path="/schools" component={Schools} />
      <Route path="/calculator" component={Calculator} />

      {/* Guides */}
      <Route path="/guides" component={GuidesIndex} />
      <Route path="/guides/how-to-become-a-pilot" component={HowToBecomePilot} />
      <Route path="/guides/pilot-training-costs" component={PilotTrainingCosts} />
      <Route path="/guides/integrated-vs-modular" component={IntegratedVsModular} />
      <Route path="/guides/class-1-medical" component={Class1Medical} />
      <Route path="/guides/airline-pilot-salary" component={AirlinePilotSalary} />
      <Route path="/guides/best-route-to-airline" component={BestRouteToAirline} />
      <Route path="/guides/finance-guide" component={FinanceGuide} />
      <Route path="/guides/training-timeline" component={TrainingTimeline} />

      {/* Admin */}
      <Route path="/admin" component={AdminDashboard} />

      {/* Static pages */}
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
