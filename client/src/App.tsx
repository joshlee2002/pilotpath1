import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CountryProvider } from "./contexts/CountryContext";

// Country selector
import CountrySelect from "./pages/CountrySelect";

// US pages
import HomeUS from "./pages/HomeUS";
import MedicalConditionLookupUS from "./pages/MedicalConditionLookupUS";
import CadetEligibilityUS from "./pages/CadetEligibilityUS";
import CalculatorUS from "./pages/CalculatorUS";
import HowToBecomePilotUS from "./pages/guides/HowToBecomePilotUS";
import SchoolsUS from "./pages/SchoolsUS";
import Part61Vs141 from "./pages/guides/Part61Vs141";
import FaaMedicalGuide from "./pages/guides/FaaMedicalGuide";

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
import AdhdPilotGuide from "./pages/guides/AdhdPilotGuide";
import BaSpeedbirdGuide from "./pages/guides/BaSpeedbirdGuide";
import IntegratedVsModularCost from "./pages/guides/IntegratedVsModularCost";
import AirlinePilotSalary from "./pages/guides/AirlinePilotSalary";
import BestRouteToAirline from "./pages/guides/BestRouteToAirline";
import FinanceGuide from "./pages/guides/FinanceGuide";
import TrainingTimeline from "./pages/guides/TrainingTimeline";

// Licence quiz
import LicenceQuiz from "./pages/LicenceQuiz";
import LicenceQuizResults from "./pages/LicenceQuizResults";

// Flight Deck quiz (top-of-funnel)
import FlightDeckQuiz from "./pages/FlightDeckQuiz";
import FlightDeckResults from "./pages/FlightDeckResults";
import FlightDeckShare from "./pages/FlightDeckShare";

// Admin
import AdminDashboard from "./pages/AdminDashboard";

// Decision tools
import IntModDecision from "./pages/IntModDecision";
import MedicalCheck from "./pages/MedicalCheck";

// Partner page
import Partner from "./pages/Partner";

// New tools
import MedicalConditionLookup from "./pages/MedicalConditionLookup";
import CadetEligibility from "./pages/CadetEligibility";

// Quiz Hub & individual quizzes
import QuizHub from "./pages/QuizHub";
import QuizPage from "./pages/quizzes/QuizPage";

// Roadmap Generator
import RoadmapGenerator from "./pages/RoadmapGenerator";

// New SEO guides
import AmITooOld from "./pages/guides/AmITooOld";
import Class1MedicalDisqualifiers from "./pages/guides/Class1MedicalDisqualifiers";
import CadetProgrammes from "./pages/guides/CadetProgrammes";
import PilotTrainingFinance2026 from "./pages/guides/PilotTrainingFinance2026";
import ModularVsIntegratedDeep from "./pages/guides/ModularVsIntegratedDeep";
import PilotSalaryUK2026 from "./pages/guides/PilotSalaryUK2026";
import ReadyToStartTraining from "./pages/guides/ReadyToStartTraining";
import HourBuilding from "./pages/guides/HourBuilding";
import AtplExams from "./pages/guides/AtplExams";
import PilotShortageUK from "./pages/guides/PilotShortageUK";
import TypeRating from "./pages/guides/TypeRating";
import RAFvsCivilian from "./pages/guides/RAFvsCivilian";
import PilotTrainingOver40 from "./pages/guides/PilotTrainingOver40";
import AirlineInterview from "./pages/guides/AirlineInterview";
import WomenInAviation from "./pages/guides/WomenInAviation";
import BestFlightSchoolsUK from "./pages/guides/BestFlightSchoolsUK";
import BASpeedbirdAcademy from "./pages/guides/BASpeedbirdAcademy";
import EasyJetGeneration from "./pages/guides/EasyJetGeneration";
import RyanairCadet from "./pages/guides/RyanairCadet";
import WizzAirAcademy from "./pages/guides/WizzAirAcademy";
import TuiMPL from "./pages/guides/TuiMPL";
import PilotAptitudeTest from "./pages/guides/PilotAptitudeTest";
import PilotCvGuide from "./pages/guides/PilotCvGuide";
import PilotAptitudeTestPrep from "./pages/guides/PilotAptitudeTestPrep";
import SimulatorAssessmentGuide from "./pages/guides/SimulatorAssessmentGuide";

// New section pages
import Stories from "./pages/Stories";
import Jobs from "./pages/Jobs";

// Simple static pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
    <Switch>
      {/* Home */}
      <Route path="/" component={Home} />

      {/* Quiz funnel */}
      <Route path="/quiz" component={Quiz} />
      <Route path="/results/:leadId" component={Results} />

      {/* Licence quiz */}
      <Route path="/quiz/licence" component={LicenceQuiz} />
      <Route path="/quiz/licence/results" component={LicenceQuizResults} />

      {/* Flight Deck quiz (top-of-funnel) */}
      <Route path="/quiz/flight-deck" component={FlightDeckQuiz} />
      <Route path="/quiz/flight-deck/results" component={FlightDeckResults} />
      <Route path="/quiz/flight-deck/share/:shareId" component={FlightDeckShare} />

      {/* Directory & tools */}
      <Route path="/schools" component={Schools} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/tools/integrated-vs-modular" component={IntModDecision} />
      <Route path="/tools/class-1-medical-check" component={MedicalCheck} />
      <Route path="/tools/medical-condition-lookup" component={MedicalConditionLookup} />
      <Route path="/tools/cadet-eligibility" component={CadetEligibility} />

      {/* Guides */}
      <Route path="/guides" component={GuidesIndex} />
      <Route path="/guides/how-to-become-a-pilot" component={HowToBecomePilot} />
      <Route path="/guides/pilot-training-costs" component={PilotTrainingCosts} />
      <Route path="/guides/integrated-vs-modular" component={IntegratedVsModular} />
      <Route path="/guides/class-1-medical" component={Class1Medical} />
      <Route path="/guides/adhd-pilot-uk" component={AdhdPilotGuide} />
      <Route path="/guides/ba-speedbird-academy" component={BaSpeedbirdGuide} />
      <Route path="/guides/integrated-vs-modular-cost" component={IntegratedVsModularCost} />
      <Route path="/guides/airline-pilot-salary" component={AirlinePilotSalary} />
      <Route path="/guides/best-route-to-airline" component={BestRouteToAirline} />
      <Route path="/guides/finance-guide" component={FinanceGuide} />
      <Route path="/guides/training-timeline" component={TrainingTimeline} />

      {/* New SEO guides */}
      <Route path="/guides/am-i-too-old-to-become-a-pilot" component={AmITooOld} />
      <Route path="/guides/class-1-medical-disqualifiers" component={Class1MedicalDisqualifiers} />
      <Route path="/guides/cadet-pilot-programmes-uk" component={CadetProgrammes} />
      <Route path="/guides/how-to-finance-pilot-training-uk" component={PilotTrainingFinance2026} />
      <Route path="/guides/modular-vs-integrated-pilot-training" component={ModularVsIntegratedDeep} />
      <Route path="/guides/uk-pilot-salary-2026" component={PilotSalaryUK2026} />
      <Route path="/guides/am-i-ready-to-start-pilot-training" component={ReadyToStartTraining} />
      <Route path="/guides/hour-building-pilot-uk" component={HourBuilding} />
      <Route path="/guides/atpl-theory-exams-uk" component={AtplExams} />
      <Route path="/guides/uk-pilot-shortage-2026" component={PilotShortageUK} />
      <Route path="/guides/pilot-type-rating-uk" component={TypeRating} />
      <Route path="/guides/raf-vs-civilian-pilot-training" component={RAFvsCivilian} />
      <Route path="/guides/pilot-training-over-40" component={PilotTrainingOver40} />
      <Route path="/guides/airline-pilot-interview" component={AirlineInterview} />
      <Route path="/guides/women-in-aviation-uk" component={WomenInAviation} />
      <Route path="/guides/best-flight-schools-uk-2026" component={BestFlightSchoolsUK} />

      {/* Cadet programme guides */}
      <Route path="/guides/ba-speedbird-academy" component={BASpeedbirdAcademy} />
      <Route path="/guides/easyjet-generation-pilot" component={EasyJetGeneration} />
      <Route path="/guides/ryanair-cadet-programme" component={RyanairCadet} />
      <Route path="/guides/wizz-air-pilot-academy" component={WizzAirAcademy} />
      <Route path="/guides/tui-mpl-cadet-programme" component={TuiMPL} />
      <Route path="/guides/pilot-aptitude-test-uk" component={PilotAptitudeTest} />
      <Route path="/guides/pilot-cv-cover-letter" component={PilotCvGuide} />
      <Route path="/guides/pilot-aptitude-test-preparation" component={PilotAptitudeTestPrep} />
      <Route path="/guides/airline-simulator-assessment" component={SimulatorAssessmentGuide} />

      {/* New section pages */}
      <Route path="/stories" component={Stories} />
      <Route path="/jobs" component={Jobs} />

      {/* Quiz Hub */}
      <Route path="/quizzes" component={QuizHub} />
      <Route path="/quizzes/:slug" component={QuizPage} />

      {/* Roadmap Generator */}
      <Route path="/roadmap" component={RoadmapGenerator} />

      {/* Admin */}
      <Route path="/admin" component={AdminDashboard} />
      {/* Partner */}
      <Route path="/partner" component={Partner} />

      {/* Static pages */}
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />

      {/* Country selector */}
      <Route path="/select" component={CountrySelect} />

      {/* US routes */}
      <Route path="/us" component={HomeUS} />
      <Route path="/us/medical-lookup" component={MedicalConditionLookupUS} />
      <Route path="/us/cadet-eligibility" component={CadetEligibilityUS} />
      <Route path="/us/calculator" component={CalculatorUS} />
      <Route path="/us/guides/how-to-become-a-pilot" component={HowToBecomePilotUS} />
      <Route path="/us/guides/part-61-vs-141" component={Part61Vs141} />
      <Route path="/us/guides/faa-medical-requirements" component={FaaMedicalGuide} />
      <Route path="/us/schools" component={SchoolsUS} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route path="*" component={NotFound} />
    </Switch>
    </>  );
}

function App() {
  return (
    <ErrorBoundary>
      <CountryProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </CountryProvider>
    </ErrorBoundary>
  );
}

export default App;
