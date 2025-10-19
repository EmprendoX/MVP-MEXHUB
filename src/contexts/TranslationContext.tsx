import { createContext, useContext, useMemo, type ReactNode } from 'react';

type NamespaceDictionary = Record<string, Record<string, unknown>>;

type TranslationContextValue = {
  locale: string;
  translations: NamespaceDictionary;
  getTranslation: (namespace: string, key: string, replacements?: Record<string, string | number>) => string;
};

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

function resolveKey(source: Record<string, unknown> | undefined, key: string): unknown {
  if (!source) return undefined;
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);
}

function applyReplacements(value: string, replacements?: Record<string, string | number>): string {
  if (!replacements) return value;
  return value.replace(/{{(.*?)}}/g, (_, token: string) => {
    const trimmed = token.trim();
    const replacement = replacements[trimmed];
    return replacement !== undefined ? String(replacement) : '';
  });
}

interface TranslationProviderProps {
  locale: string;
  translations: NamespaceDictionary;
  children: ReactNode;
}

export function TranslationProvider({ locale, translations, children }: TranslationProviderProps) {
  const value = useMemo<TranslationContextValue>(() => ({
    locale,
    translations,
    getTranslation: (namespace, key, replacements) => {
      const namespaceTranslations = translations[namespace];
      const resolved = resolveKey(namespaceTranslations, key);
      if (typeof resolved === 'string') {
        return applyReplacements(resolved, replacements);
      }
      if (typeof resolved === 'number') {
        return String(resolved);
      }
      return key;
    },
  }), [locale, translations]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslation(namespace = 'common') {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  const t = (key: string, replacements?: Record<string, string | number>) =>
    context.getTranslation(namespace, key, replacements);

  return { t, locale: context.locale };
}
