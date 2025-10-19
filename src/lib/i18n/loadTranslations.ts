import fs from 'fs';
import path from 'path';

type NamespaceDictionary = Record<string, Record<string, unknown>>;

const DEFAULT_LOCALE = 'es';

export async function loadTranslations(locale: string | undefined, namespaces: string[]): Promise<NamespaceDictionary> {
  const activeLocale = locale || DEFAULT_LOCALE;
  const basePath = path.join(process.cwd(), 'public', 'locales');
  const translations: NamespaceDictionary = {};

  for (const namespace of namespaces) {
    const localePath = path.join(basePath, activeLocale, `${namespace}.json`);
    const defaultLocalePath = path.join(basePath, DEFAULT_LOCALE, `${namespace}.json`);

    try {
      const fileContent = await fs.promises.readFile(localePath, 'utf-8');
      translations[namespace] = JSON.parse(fileContent);
      continue;
    } catch (error) {
      // Fall back to default locale if the requested locale file is missing
    }

    try {
      const fallbackContent = await fs.promises.readFile(defaultLocalePath, 'utf-8');
      translations[namespace] = JSON.parse(fallbackContent);
    } catch (fallbackError) {
      console.warn(`⚠️ Missing translation namespace "${namespace}" for locale "${activeLocale}"`);
      translations[namespace] = {};
    }
  }

  return translations;
}
