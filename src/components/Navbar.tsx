'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from '@/contexts/TranslationContext';

const Navbar = () => {
  const router = useRouter();
  const { t, locale } = useTranslation('common');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigation = useMemo(
    () => [
      { name: t('navigation.home'), href: '/' },
      { name: t('navigation.explore'), href: '/explore' },
      { name: t('navigation.publish'), href: '/publish' },
      { name: t('navigation.messages'), href: '/messages' },
      { name: t('navigation.dashboard'), href: '/dashboard' },
    ],
    [t]
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const handleLanguageChange = (nextLocale: string) => {
    if (nextLocale === locale) return;
    router.push(router.asPath, undefined, { locale: nextLocale });
  };

  const availableLocales = router.locales || ['es', 'en'];

  const isCurrentPath = (href: string) => {
    if (href === '/') {
      return router.pathname === '/' || router.asPath === '/';
    }
    return router.pathname.startsWith(href);
  };

  const renderSearchField = (inputClassName: string) => (
    <div className="relative">
      <input
        type="text"
        placeholder={t('navbar.searchPlaceholder')}
        className={`${inputClassName} pl-10`}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );

  return (
    <nav className="bg-dark-500 border-b border-gray-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-gradient">{t('brandName')}</div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  locale={locale}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isCurrentPath(item.href)
                      ? 'text-primary bg-light-bg'
                      : 'text-text-soft hover:text-text-light hover:bg-light-bg'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Search & User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={toggleSearch}
              className="p-2 text-text-soft hover:text-text-light transition-colors duration-200"
              aria-label={t('navbar.search')}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <select
                className="bg-dark-500 border border-gray-light text-text-soft text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                value={locale}
                onChange={(event) => handleLanguageChange(event.target.value)}
                aria-label={t('navbar.language')}
              >
                {availableLocales.map((lang) => (
                  <option key={lang} value={lang}>
                    {t(`navbar.languageName.${lang}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* User Menu Placeholder */}
            <div className="relative">
              <button className="flex items-center text-text-soft hover:text-text-light transition-colors duration-200">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-dark text-sm font-medium">U</span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleSearch}
              className="p-2 text-text-soft hover:text-text-light transition-colors duration-200"
              aria-label={t('navbar.search')}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-text-soft hover:text-text-light transition-colors duration-200"
              aria-label={t('navbar.openMenu')}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden border-t border-gray-light bg-light-bg">
          <div className="px-4 py-3">{renderSearchField('input-field w-full')}</div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-light bg-light-bg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                locale={locale}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isCurrentPath(item.href)
                    ? 'text-primary bg-dark-500'
                    : 'text-text-soft hover:text-text-light hover:bg-dark-500'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Language Selector */}
            <div className="border-t border-gray-light pt-3 mt-3">
              <label className="block text-text-soft text-xs uppercase tracking-wide mb-2">
                {t('navbar.language')}
              </label>
              <div className="flex space-x-2">
                {availableLocales.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      handleLanguageChange(lang);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium border ${
                      locale === lang
                        ? 'border-primary text-primary'
                        : 'border-gray-light text-text-soft hover:border-primary hover:text-text-light'
                    }`}
                  >
                    {t(`navbar.languageName.${lang}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile User Section */}
            <div className="border-t border-gray-light pt-3 mt-3">
              <div className="flex items-center px-3 py-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                  <span className="text-dark text-sm font-medium">U</span>
                </div>
                <div>
                  <p className="text-text-light text-sm font-medium">{t('navbar.userDemo')}</p>
                  <p className="text-text-soft text-xs">{t('navbar.userRole')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Search Modal */}
      {isSearchOpen && (
        <div className="hidden md:block absolute top-full left-0 right-0 bg-light-bg border-b border-gray-light shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative max-w-2xl">{renderSearchField('input-field w-full')}</div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
