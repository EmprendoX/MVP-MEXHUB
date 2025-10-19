import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { TranslationProvider } from '@/contexts/TranslationContext';

type TranslationsProp = Record<string, Record<string, unknown>>;

type CustomAppProps = AppProps<{ translations?: TranslationsProp }>;

export default function App({ Component, pageProps, router }: CustomAppProps) {
  const locale = router?.locale ?? router?.defaultLocale ?? 'es';
  const translations = pageProps.translations ?? {};

  return (
    <AuthProvider>
      <TranslationProvider locale={locale} translations={translations}>
        <Component {...pageProps} />
      </TranslationProvider>
    </AuthProvider>
  );
}
