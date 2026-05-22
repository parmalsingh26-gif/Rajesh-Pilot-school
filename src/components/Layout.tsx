import { Outlet } from 'react-router-dom';
import TopHeader from './TopHeader';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import AIChatbot from './AIChatbot';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <TopHeader />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <AIChatbot />
    </div>
  );
}
