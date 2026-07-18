/* eslint-disable react/prop-types */
import { FaInstagram, FaTwitter, FaYoutube, FaFacebook, FaLinkedin } from "react-icons/fa";
import Logo from "../uic/Logo.jsx";

const SocialButton = ({ children, label, href }) => {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all inline-flex items-center justify-center cursor-pointer border border-zinc-700/50"
    >
      {children}
    </a>
  );
};

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 text-left pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-zinc-200 font-semibold text-sm mb-4">For Clients</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">How to Hire</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Talent Marketplace</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Project Catalog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Enterprise Solutions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-zinc-200 font-semibold text-sm mb-4">For Talent</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">How to Find Work</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Direct Contracts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Find Freelance Jobs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">QuickWork HQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-zinc-200 font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Help & Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog Insights</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-zinc-200 font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <hr className="border-zinc-900 my-8" />

        {/* Footer Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold text-lg tracking-tight">QUICKWORK</span>
            <span className="text-zinc-600 text-xs">|</span>
            <p className="text-xs text-zinc-500">© 2026 QUICKWORK Inc. All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <SocialButton label="Twitter" href="#">
              <FaTwitter className="text-sm" />
            </SocialButton>
            <SocialButton label="YouTube" href="#">
              <FaYoutube className="text-sm" />
            </SocialButton>
            <SocialButton label="Instagram" href="#">
              <FaInstagram className="text-sm" />
            </SocialButton>
            <SocialButton label="Facebook" href="#">
              <FaFacebook className="text-sm" />
            </SocialButton>
            <SocialButton label="LinkedIn" href="#">
              <FaLinkedin className="text-sm" />
            </SocialButton>
          </div>
        </div>
      </div>
    </footer>
  );
}