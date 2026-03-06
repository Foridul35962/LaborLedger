import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white tracking-tighter">
              Labor<span className="text-amber-500">Ledger</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-xs">
              Attendance & Wage Management for Construction Sites. 
              Digitizing the workflow to eliminate disputes and save time.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-amber-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition-colors underline-offset-4 hover:underline">About Project</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors underline-offset-4 hover:underline">Features</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors underline-offset-4 hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors underline-offset-4 hover:underline">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-amber-500" /> 
                Dhaka, Bangladesh
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-500" /> 
                +880 1XXX-XXXXXX
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-500" /> 
                support@laborledger.com
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest text-slate-500">
          <p>© 2026 LaborLedger. All rights reserved.</p>
          <p>Built with Precision for Construction Teams</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;