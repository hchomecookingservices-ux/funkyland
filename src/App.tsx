
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BillingPage from './pages/BillingPage';
import TrackingPage from './pages/TrackingPage';
import CalendarPage from './pages/CalendarPage';
import MembersPage from './pages/MembersPage';
import AccountingPage from './pages/AccountingPage';
import PlansPage from './pages/PlansPage';
import ServicesPage from './pages/ServicesPage';
import CataloguePage from './pages/CataloguePage';
import ReportsPage from './pages/ReportsPage';

import { PlayZoneProvider, usePlayZone } from './hooks/usePlayZone';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = usePlayZone();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const { isAuthenticated } = usePlayZone();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={() => {}} />
        } />
        
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="catalogue" element={<CataloguePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="accounting" element={<AccountingPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
