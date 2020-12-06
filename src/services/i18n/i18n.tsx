import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';

import en from '../../translations/en.json';
import pl from '../../translations/pl.json';

// load translations
i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false }, // React already does escaping
    lng: 'en',
    defaultNS: 'common',
    resources: {
      en: { common: en },
      pl: { common: pl },
    },
  });

export default i18n;
