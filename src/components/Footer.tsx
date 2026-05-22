import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { GraduationCap, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12 border-t-4 border-blue-600 dark:border-blue-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* School Identity */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white border border-blue-600">
              <img src="/school-logo.jpg" alt="School Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-white text-sm font-bold leading-tight">RAJESH PILOT</h3>
              <p className="text-blue-400 text-xs font-medium">SECONDARY SCHOOL</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Providing quality education in the heart of Bonl village, Thodabhim, Karauli. Affiliated with RBSE, committed to excellence since inception.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">{t('Quick Links')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">{t('Home')}</Link></li>
            <li><Link to="/about/history" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><Link to="/admission" className="hover:text-blue-400 transition-colors">Admission Process</Link></li>
            <li><Link to="/admissions/fee-structure" className="hover:text-blue-400 transition-colors">Fee Structure</Link></li>
            <li><Link to="/notifications" className="hover:text-blue-400 transition-colors">Notifications</Link></li>
            <li><Link to="/results" className="hover:text-blue-400 transition-colors">Results</Link></li>
            <li><Link to="/career" className="hover:text-blue-400 transition-colors">Career</Link></li>
            <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">{t('Contact Us')}</Link></li>
          </ul>
        </div>

        {/* Important Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">{t('Important Links')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="https://rajeduboard.rajasthan.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">RBSE Official Website</a></li>
            <li><a href="https://rajeduboard.rajasthan.gov.in/Result" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">RBSE Results</a></li>
            <li><a href="https://rajasthan.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Rajasthan Government</a></li>
            <li><a href="https://scholarship.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">National Scholarships</a></li>
            <li><a href="https://ncert.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">NCERT</a></li>
            <li><Link to="/admin/login" className="hover:text-blue-400 transition-colors">{t('Admin Login')}</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">{t('Contact Info')}</h4>
          <address className="not-italic text-sm text-slate-400 space-y-3">
            <div className="flex gap-2">
              <MapPin size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p>Village – Bonl,</p>
                <p>Tehsil – Thodabhim,</p>
                <p>Dist. – Karauli (Raj.)</p>
                <p>PIN – 321611</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Phone size={14} className="text-blue-400 shrink-0" />
              <div>
                <a href="tel:+919983264013" className="block hover:text-blue-400 transition-colors">9983264013</a>
                <a href="tel:+916376157995" className="block hover:text-blue-400 transition-colors">6376157995</a>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Mail size={14} className="text-blue-400 shrink-0" />
              <a href="mailto:Doiramavtar16@gmail.com" className="hover:text-blue-400 transition-colors break-all">Doiramavtar16@gmail.com</a>
            </div>
          </address>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-800 text-xs text-center text-slate-500">
        &copy; {new Date().getFullYear()} Rajesh Pilot Secondary School, Bonl – Karauli, Rajasthan. All rights reserved.
      </div>
    </footer>
  );
}
