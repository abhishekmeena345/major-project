import { GraduationCap, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">
                Smart Placement
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered placement portal connecting students with their dream careers. 
              Smart matching, real-time updates, and seamless recruitment.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-primary-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="/login" className="hover:text-primary-400 transition-colors">Login</a>
              </li>
              <li>
                <a href="/register" className="hover:text-primary-400 transition-colors">Register</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">About Us</a>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Users</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">Students</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">Companies</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">TPO Officers</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">Alumni</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span>support@smartplacement.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary-400 mt-0.5" />
                <span>College Campus, Tech City, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>
            © {currentYear} Smart Placement Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;