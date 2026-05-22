/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';
import PlaceholderPage from './pages/PlaceholderPage';
import Notifications from './pages/Notifications';
import EmployeeCorner from './pages/EmployeeCorner';
import Gallery from './pages/Gallery';
import SearchResults from './pages/SearchResults';
import ContactUs from './pages/ContactUs';
import Results from './pages/Results.tsx';
import AdmissionPage from './pages/AdmissionPage';
import FAQPage from './pages/FAQPage';
import CareerPage from './pages/CareerPage';

const FONT_SIZE_KEY = 'fontSize';
const DEFAULT_FONT_SIZE = '16px';

function applyStoredFontSize() {
  try {
    const stored = localStorage.getItem(FONT_SIZE_KEY);
    const size = stored === '14' || stored === '18' ? `${stored}px` : DEFAULT_FONT_SIZE;
    document.documentElement.style.fontSize = size;
  } catch (_) {
    document.documentElement.style.fontSize = DEFAULT_FONT_SIZE;
  }
}

export default function App() {
  useEffect(() => {
    applyStoredFontSize();
  }, []);

  return (
    <LanguageProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="employee" element={<EmployeeCorner />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="results" element={<Results />} />
          {/* New School Pages */}
          <Route path="admission" element={<AdmissionPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="career" element={<CareerPage />} />
          {/* Placeholder / Admin-editable pages */}
          <Route path="*" element={<PlaceholderPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
    </LanguageProvider>
  );
}
