import { Code as Code2, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Changelog', href: '#' },
  { label: 'Status', href: '#' },
];

export default function Footer() {
  return (
    <footer
      className="relative border-t"
      style={{ backgroundColor: '#0a1120', borderColor: 'rgba(73,68,84,0.3)' }}
    >
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #4ae176 0%, #00a74b 100%)' }}
              >
                <Code2 className="w-4 h-4" style={{ color: '#0c1324' }} />
              </div>
              <span className="text-lg font-bold tracking-tight" style={{ color: '#dce1fb' }}>
                Dev<span className="text-gradient-primary">Sphere</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#cbc3d7' }}>
              The next-generation cloud compiler built for the editorial engineer. Experience speed, precision, and AI-driven development.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: '#151b2d', color: '#cbc3d7' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#d0bcff';
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#23293c';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#cbc3d7';
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#151b2d';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 font-grotesk" style={{ color: '#dce1fb' }}>Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Changelog', 'Roadmap'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200 hover:text-ds-primary"
                    style={{ color: '#cbc3d7' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 font-grotesk" style={{ color: '#dce1fb' }}>Resources</h4>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Community', 'Blog'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200 hover:text-ds-primary"
                    style={{ color: '#cbc3d7' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: 'rgba(73,68,84,0.3)' }}
        >
          <p className="text-xs" style={{ color: '#cbc3d7' }}>
            &copy; 2024 DevSphere Monolith. Built for the editorial engineer.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs transition-colors duration-200 hover:text-ds-primary"
                style={{ color: '#cbc3d7' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
