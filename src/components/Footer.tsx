import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext';

const Footer = () => {
  const { t, locale } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { name: t('footer.navigationLinks.home'), href: '/' },
    { name: t('footer.navigationLinks.explore'), href: '/explore' },
    { name: t('footer.navigationLinks.publish'), href: '/publish' },
    { name: t('footer.navigationLinks.messages'), href: '/messages' },
    { name: t('footer.navigationLinks.dashboard'), href: '/dashboard' },
  ];

  const companyLinks = [
    { name: t('footer.companyLinks.about'), href: '/about' },
    { name: t('footer.companyLinks.howItWorks'), href: '/how-it-works' },
    { name: t('footer.companyLinks.pricing'), href: '/pricing' },
    { name: t('footer.companyLinks.blog'), href: '/blog' },
    { name: t('footer.companyLinks.careers'), href: '/careers' },
  ];

  const supportLinks = [
    { name: t('footer.supportLinks.helpCenter'), href: '/help' },
    { name: t('footer.supportLinks.contact'), href: '/contact' },
    { name: t('footer.supportLinks.status'), href: '/status' },
    { name: t('footer.supportLinks.report'), href: '/report' },
    { name: t('footer.supportLinks.support'), href: '/support' },
  ];

  const legalLinks = [
    { name: t('footer.legal.terms'), href: '/terms' },
    { name: t('footer.legal.privacy'), href: '/privacy' },
    { name: t('footer.legal.cookies'), href: '/cookies' },
    { name: t('footer.legal.conditions'), href: '/conditions' },
  ];

  const socialLinks = [
    { name: 'LinkedIn', href: '#' },
    { name: 'Twitter', href: '#' },
    { name: 'Facebook', href: '#' },
    { name: 'Instagram', href: '#' },
  ];

  const socialIcons: Record<string, JSX.Element> = {
    LinkedIn: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    Twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    Facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    Instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z" />
      </svg>
    ),
  };

  return (
    <footer className="bg-dark-500 border-t border-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="text-2xl font-bold text-gradient">{t('brandName')}</div>
            </div>
            <p className="text-text-soft mb-6 max-w-md">{t('footer.description')}</p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-text-soft hover:text-primary transition-colors duration-200"
                  aria-label={social.name}
                >
                  {socialIcons[social.name]}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-text-light font-semibold mb-4">{t('footer.navigation')}</h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} locale={locale} className="text-text-soft hover:text-text-light transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-text-light font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} locale={locale} className="text-text-soft hover:text-text-light transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-text-light font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} locale={locale} className="text-text-soft hover:text-text-light transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-light">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-start space-x-6">
              {legalLinks.map((link, index) => (
                <div key={link.href} className="flex items-center">
                  <Link href={link.href} locale={locale} className="text-text-soft hover:text-text-light transition-colors duration-200 text-sm">
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && <span className="mx-3 text-text-soft">•</span>}
                </div>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-text-soft text-sm">
              © {currentYear} {t('brandName')}. {t('footer.rights')}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-8 border-t border-gray-light">
          <div className="text-center text-text-soft text-sm">
            <p className="mb-2">
              <strong>{t('footer.madeInMexico')}</strong> {t('footer.tagline')}
            </p>
            <p>🏭 🇲🇽 🌍</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
