import { Route, Routes } from "react-router";
import { useEffect } from "react";
import Login from "./pages/onboarding/Login";
import Signup from "./pages/onboarding/Signup";
import EmailVerification from "./pages/onboarding/EmailVerification";
import OnboardingLayout from "./components/layouts/OnboardingLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import PasswordSetup from "./pages/onboarding/PasswordSetup";
import ProfileInfo from "./pages/onboarding/ProfileInfo";
import PinSetup from "./pages/onboarding/PinSetup";
import EventCreation from "./pages/onboarding/EventCreation";
import ManageEvents from "./pages/manageEvents/ManageEvents";
import ManageSeries from "./pages/manageSeries/ManageSeries";
import BulkAnnouncement from "./pages/bulkAnnouncements/BulkAnnouncement";
import Reports from "./pages/reports/Reports";
import PayoutManagement from "./pages/payoutManagement/PayoutManagement";
import DashboardLayout from "./components/layouts/DashboardLayout";
import EventPage from "./pages/manageEvents/EventPage";
import CreateTicket from "./pages/manageEvents/components/CreateTicket";
import CreateEvent from "./pages/createEvent/CreateEvent";
import SeriesDetail from "./pages/manageSeries/components/SeriesDetail";
import Settings from "./pages/payoutManagement/Settings";
import Profile from "./pages/profile/Profile";
import ForgotPassword from "./pages/onboarding/forgotPassword/ForgotPassword";
import NotFound from "./pages/NotFound";

const App = () => {
  useEffect(() => {
    console.log("App component loaded successfully");
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Onboarding Routes */}
        <Route
          path="/emailVerification"
          element={
            <OnboardingLayout>
              <EmailVerification />
            </OnboardingLayout>
          }
        />
        <Route
          path="/passwordSetup"
          element={
            <OnboardingLayout>
              <PasswordSetup />
            </OnboardingLayout>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/profileInformation"
          element={
            <OnboardingLayout>
              <ProfileInfo />
            </OnboardingLayout>
          }
        />
        <Route
          path="/pinSetup"
          element={
            <OnboardingLayout>
              <PinSetup />
            </OnboardingLayout>
          }
        />
        <Route
          path="/createEventSeries"
          element={
            <OnboardingLayout>
              <EventCreation />
            </OnboardingLayout>
          }
        />
        {/* Main components */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/create-event" element={<DashboardLayout><CreateEvent /></DashboardLayout>} />

        <Route
          path="/manage-events"
          element={
            <DashboardLayout>
              <ManageEvents />
            </DashboardLayout>
          }
        />
        <Route
          path="/manage-events/:id"
          element={
            <DashboardLayout>
              <EventPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/manage-events/:id/create-ticket"
          element={
            <DashboardLayout>
              <CreateTicket />
            </DashboardLayout>
          }
        />
        <Route
          path="/manage-series"
          element={
            <DashboardLayout>
              <ManageSeries />
            </DashboardLayout>
          }
        />
        <Route
          path="/manage-series/:id"
          element={
            <DashboardLayout>
              <SeriesDetail />
            </DashboardLayout>
          }
        />
        <Route
          path="/bulk-announcements"
          element={
            <DashboardLayout>
              <BulkAnnouncement />
            </DashboardLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          }
        />
        <Route
          path="/payout-management"
          element={
            <DashboardLayout>
              <PayoutManagement />
            </DashboardLayout>
          }
        />
        <Route
          path="/payout-management/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

    </>
  );
};

export default App;