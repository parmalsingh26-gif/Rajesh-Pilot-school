import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { GraduationCap, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12 border-t-4 border-blue-600 dark:border-blue-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0">
              <GraduationCap size={22} />
            </div>
            <h3 className="text-white text-lg font-bold">Rajesh Pilot School</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Nurturing young minds with quality education, strong values, and a commitment to excellence since 2000. Affiliated with CBSE.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">{t('Quick Links')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">{t('Home')}</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition-colors">{t('About Us')}</Link></li>
            <li><Link to="/admission" className="hover:text-blue-400 transition-colors">Admission Process</Link></li>
            <li><Link to="/fees" className="hover:text-blue-400 transition-colors">Fee Structure</Link></li>
            <li><Link to="/notifications" className="hover:text-blue-400 transition-colors">Notifications</Link></li>
            <li><Link to="/results" className="hover:text-blue-400 transition-colors">Results</Link></li>
            <li><Link to="/career" className="hover:text-blue-400 transition-colors">Career</Link></li>
            <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">{t('Contact Us')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">{t('Important Links')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="https://cbse.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">CBSE Official Website</a></li>
            <li><a href="https://cbseresults.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">CBSE Results</a></li>
            <li><a href="https://ncert.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">NCERT</a></li>
            <li><a href="https://scholarship.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">National Scholarships</a></li>
            <li><Link to="/admin/login" className="hover:text-blue-400 transition-colors">{t('Admin Login')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">{t('Contact Info')}</h4>
          <address className="not-italic text-sm text-slate-400 space-y-3">
            <div className="flex gap-2">
              <MapPin size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p>Rajesh Pilot School,</p>
                <p>School Road, City Name,</p>
                <p>State – 000000</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Phone size={14} className="text-blue-400 shrink-0" />
              <p>+91-XX-XXXX-XXXX</p>
            </div>
            <div className="flex gap-2 items-center">
              <Mail size={14} className="text-blue-400 shrink-0" />
              <p>info@rajeshpilotschool.edu.in</p>
            </div>
          </address>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
        &copy; {new Date().getFullYear()} Rajesh Pilot School. All rights reserved. | Affiliated with CBSE
      </div>
    </footer>
  );
}
